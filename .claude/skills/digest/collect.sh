#!/usr/bin/env bash
# /digest data collector. Fans out GitHub queries, applies heuristic
# filters, and emits structured JSON to stdout.
#
# Usage: collect.sh [cadence]
# Cadence: Nd | Nw | Nm | Ny  (default: 7d)

set -euo pipefail

LOGIN=alunduil
# gh's search API hard-caps at 1000; 300 covers observed spiky weeks
# (~100s of PRs/issues) without ballooning synthesis-pass tokens.
LIMIT=300

SQUASH_MERGE_RE=' \(#[0-9]+\)$'
SYNC_NOISE_REPO='alunduil/alunduil-claustre-state'
SYNC_NOISE_SUBJECT_RE='^sync: '
NOISE_REF_RE='^(task/|release-please--)'
INTEREST_EVENT_TYPES=(WatchEvent ForkEvent CreateEvent ReleaseEvent PublicEvent MemberEvent GollumEvent)

# Extracts owner/repo from a github.com URL by positional split.
REPO_FROM_URL='(.url | split("/") | .[3] + "/" + .[4])'

resolve_since() {
  local cadence="$1"
  case "$cadence" in
    [1-9]*[0-9]*d | [1-9]d) date -d "${cadence%d} days ago" -u +%Y-%m-%d ;;
    [1-9]*[0-9]*w | [1-9]w) date -d "${cadence%w} weeks ago" -u +%Y-%m-%d ;;
    [1-9]*[0-9]*m | [1-9]m) date -d "${cadence%m} months ago" -u +%Y-%m-%d ;;
    [1-9]*[0-9]*y | [1-9]y) date -d "${cadence%y} years ago" -u +%Y-%m-%d ;;
    *)
      echo "error: invalid cadence '$cadence'. Expected: Nd | Nw | Nm | Ny" >&2
      return 2
      ;;
  esac
}

filter_commits() {
  jq --arg sync_repo "$SYNC_NOISE_REPO" \
    --arg sync_re "$SYNC_NOISE_SUBJECT_RE" \
    --arg squash_re "$SQUASH_MERGE_RE" \
    '[.[]
     | {repo: .repository.fullName,
        sha: .sha[:7],
        subject: (.commit.message | split("\n")[0]),
        date: .commit.author.date}
     | select(.subject | test($squash_re) | not)
     | select(.subject | test($sync_re) | not)
     | select(.repo != $sync_repo)
    ]'
}

filter_prs_opened() {
  jq "[.[] | {repo: $REPO_FROM_URL, n: .number, title, state, url, createdAt}]"
}

filter_prs_reviewed() {
  jq "[.[] | {repo: $REPO_FROM_URL, n: .number, title, url, author: .author.login, updatedAt}]"
}

filter_issues_opened() {
  jq "[.[] | {repo: $REPO_FROM_URL, n: .number, title, state, url, createdAt}]"
}

filter_issues_closed() {
  jq "[.[] | {repo: $REPO_FROM_URL, n: .number, title, state, url, closedAt}]"
}

filter_commented() {
  jq "[.[] | {repo: $REPO_FROM_URL, n: .number, title, url, updatedAt}]"
}

filter_events() {
  local since="$1"
  local types_json
  types_json=$(printf '%s\n' "${INTEREST_EVENT_TYPES[@]}" | jq -Rsc 'split("\n") | map(select(. != ""))')
  jq --argjson types "$types_json" \
    --arg ref_re "$NOISE_REF_RE" \
    --arg since "$since" \
    '[.[]
     | select(.created_at >= $since)
     | select(.type as $t | $types | index($t))
     | select((.type != "CreateEvent") or (.payload.ref | test($ref_re) | not))
     | {type, repo: .repo.name, created_at, payload}
    ]'
}

# Each fetch_* returns {raw_count, items} so main() can detect whether
# a query saturated the limit (silent truncation is the worst failure).
package() {
  local raw="$1" filtered="$2"
  jq -n --argjson n "$(jq 'length // 0' <<<"$raw")" \
    --argjson i "$filtered" \
    '{raw_count: $n, items: $i}'
}

# Generic search wrapper: gh_search SUBCMD QUAL DATE_FLAG SINCE FIELDS FILTER_FN
gh_search() {
  local subcmd=$1 qual=$2 date_flag=$3 since=$4 fields=$5 filter_fn=$6
  local raw
  raw=$(gh search "$subcmd" "$qual=@me" "$date_flag=>$since" \
    --limit "$LIMIT" --json "$fields" 2>/dev/null)
  package "$raw" "$("$filter_fn" <<<"$raw")"
}

fetch_commits()       { gh_search commits --author      --author-date "$1" repository,sha,commit             filter_commits; }
fetch_prs_opened()    { gh_search prs     --author      --created     "$1" number,title,state,url,createdAt  filter_prs_opened; }
fetch_prs_reviewed()  { gh_search prs     --reviewed-by --updated     "$1" number,title,url,author,updatedAt filter_prs_reviewed; }
fetch_issues_opened() { gh_search issues  --author      --created     "$1" number,title,state,url,createdAt  filter_issues_opened; }
fetch_issues_closed() { gh_search issues  --author      --closed      "$1" number,title,state,url,closedAt   filter_issues_closed; }
fetch_commented()     { gh_search issues  --commenter   --updated     "$1" number,title,url,updatedAt        filter_commented; }

# Reads {name: raw_count, ...} on stdin, emits sorted array of names
# whose count saturated the limit.
detect_truncated() {
  jq --argjson limit "$LIMIT" \
    '[to_entries[] | select(.value >= $limit) | .key] | sort'
}

# Reads {commits, prs_opened, prs_reviewed, issues_opened, issues_closed,
# commented} mapped to filtered item arrays on stdin. Emits a per-repo
# rollup: {"owner/repo": {commits: N, prs_opened: N, ..., days_active: [...]}}.
# Items missing repo or date are dropped. days_active is unique-sorted.
rollup_repos() {
  jq '
    def to_records(field; src; date_field):
      (.[field] // []) | map({
        repo,
        source: src,
        day: ((.[date_field] // "") | tostring | .[0:10])
      });
    [
      to_records("commits"; "commits"; "date"),
      to_records("prs_opened"; "prs_opened"; "createdAt"),
      to_records("prs_reviewed"; "prs_reviewed"; "updatedAt"),
      to_records("issues_opened"; "issues_opened"; "createdAt"),
      to_records("issues_closed"; "issues_closed"; "closedAt"),
      to_records("commented"; "commented"; "updatedAt")
    ]
    | add
    | map(select(.repo != null and .day != ""))
    | group_by(.repo)
    | map({
        key: .[0].repo,
        value: (
          reduce .[] as $i (
            {commits: 0, prs_opened: 0, prs_reviewed: 0,
             issues_opened: 0, issues_closed: 0, commented: 0,
             days_active: []};
            .[$i.source] += 1
            | .days_active += [$i.day]
          )
          | .days_active |= (unique | sort)
        )
      })
    | from_entries
  '
}

fetch_events() {
  local since="$1" include="$2"
  if [[ "$include" != "true" ]]; then
    echo '[]'
    return
  fi
  gh api "users/$LOGIN/events?per_page=100" --paginate 2>/dev/null |
    jq -s 'add // []' | filter_events "$since"
}

main() {
  local cadence="${1:-7d}"
  local since now since_epoch now_epoch days include_events
  since=$(resolve_since "$cadence")
  now=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  since_epoch=$(date -d "$since" -u +%s)
  now_epoch=$(date -u +%s)
  days=$(((now_epoch - since_epoch) / 86400))
  include_events=true
  if ((days > 90)); then
    include_events=false
  fi

  local commits_pkg prs_opened_pkg prs_reviewed_pkg
  local issues_opened_pkg issues_closed_pkg commented_pkg
  commits_pkg=$(fetch_commits "$since")
  prs_opened_pkg=$(fetch_prs_opened "$since")
  prs_reviewed_pkg=$(fetch_prs_reviewed "$since")
  issues_opened_pkg=$(fetch_issues_opened "$since")
  issues_closed_pkg=$(fetch_issues_closed "$since")
  commented_pkg=$(fetch_commented "$since")

  local truncated repos
  truncated=$(jq -nc \
    --argjson commits "$commits_pkg" \
    --argjson prs_opened "$prs_opened_pkg" \
    --argjson prs_reviewed "$prs_reviewed_pkg" \
    --argjson issues_opened "$issues_opened_pkg" \
    --argjson issues_closed "$issues_closed_pkg" \
    --argjson commented "$commented_pkg" \
    '{commits: $commits.raw_count,
      prs_opened: $prs_opened.raw_count,
      prs_reviewed: $prs_reviewed.raw_count,
      issues_opened: $issues_opened.raw_count,
      issues_closed: $issues_closed.raw_count,
      commented: $commented.raw_count}' | detect_truncated)

  repos=$(jq -nc \
    --argjson commits "$commits_pkg" \
    --argjson prs_opened "$prs_opened_pkg" \
    --argjson prs_reviewed "$prs_reviewed_pkg" \
    --argjson issues_opened "$issues_opened_pkg" \
    --argjson issues_closed "$issues_closed_pkg" \
    --argjson commented "$commented_pkg" \
    '{commits: $commits.items,
      prs_opened: $prs_opened.items,
      prs_reviewed: $prs_reviewed.items,
      issues_opened: $issues_opened.items,
      issues_closed: $issues_closed.items,
      commented: $commented.items}' | rollup_repos)

  jq -n \
    --arg since "$since" \
    --arg now "$now" \
    --argjson include_events "$include_events" \
    --argjson limit "$LIMIT" \
    --argjson truncated "$truncated" \
    --argjson repos "$repos" \
    --argjson commits "$commits_pkg" \
    --argjson prs_opened "$prs_opened_pkg" \
    --argjson prs_reviewed "$prs_reviewed_pkg" \
    --argjson issues_opened "$issues_opened_pkg" \
    --argjson issues_closed "$issues_closed_pkg" \
    --argjson commented "$commented_pkg" \
    --argjson events "$(fetch_events "$since" "$include_events")" \
    '{window: {since: $since, now: $now, events_included: $include_events,
               limit: $limit, truncated: $truncated},
      repos: $repos,
      commits: $commits.items,
      prs_opened: $prs_opened.items,
      prs_reviewed: $prs_reviewed.items,
      issues_opened: $issues_opened.items,
      issues_closed: $issues_closed.items,
      commented: $commented.items,
      events: $events}'
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main "$@"
fi
