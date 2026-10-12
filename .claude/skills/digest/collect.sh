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
# Owners of the repos on the Inbox project board.
MILESTONE_OWNERS=(alunduil dungeon-studio qua-world)
# Release-version milestones have no objective or key results.
OBJECTIVE_TITLE_RE='^[0-9]{4}-[0-9]{2}: '

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

gh_api_all() {
  gh api --paginate "$1" 2>/dev/null | jq -s 'add // []'
}

inbox_repos() {
  local owner
  for owner in "${MILESTONE_OWNERS[@]}"; do
    gh api --paginate "users/$owner/repos?per_page=100&type=owner" \
      --jq '.[] | select(.archived | not) | select(.has_issues) | .full_name' 2>/dev/null
  done
}

# Per the milestones skill, key results are the description's checklist
# items and the score is its `Scored N/M` line.
filter_milestones() {
  local repo="$1" since="$2"
  jq --arg repo "$repo" --arg since "$since" --arg title_re "$OBJECTIVE_TITLE_RE" \
    '[.[]
     | select(.title | test($title_re))
     | select(.state == "open" or ((.closed_at // "") >= $since))
     | (.description // "") as $desc
     | ($desc | [scan("(?m)^\\s*- \\[([ xX])\\] ")[0]]) as $krs
     | {repo: $repo, number, title, state, url: .html_url,
        closed_at,
        open_issues, closed_issues,
        key_results: ($krs | length),
        key_results_done: ($krs | map(select(. != " ")) | length),
        score: ($desc | (capture("Scored (?<s>[0-9]+/[0-9]+)").s) // null)}
    ]'
}

# The REST issues endpoint also returns pull requests.
filter_closed_issues() {
  local repo="$1" since="$2"
  jq --arg repo "$repo" --arg since "$since" \
    '[.[]
     | select(.pull_request == null)
     | select((.closed_at // "") >= $since)
     | {repo: $repo, n: .number, closed_at, state_reason,
        milestone: (.milestone.number // null)}
    ]'
}

# Counts completed closes only: a not-planned close moves no key result.
rollup_milestones() {
  jq '
    (.closed_issues | map(select(.state_reason == "completed"))) as $done
    | {
        milestones: (.milestones | map(
          . as $m
          | .closed_in_window = ($done | map(select(.repo == $m.repo and .milestone == $m.number)) | length)
        )),
        closed_in_window: ($done | group_by(.repo) | map({key: .[0].repo, value: length}) | from_entries)
      }
  '
}

fetch_repo_milestones() {
  local repo="$1" since="$2"
  jq -n \
    --argjson m "$(gh_api_all "repos/$repo/milestones?state=all&per_page=100" | filter_milestones "$repo" "$since")" \
    --argjson c "$(gh_api_all "repos/$repo/issues?state=closed&since=${since}T00:00:00Z&per_page=100" | filter_closed_issues "$repo" "$since")" \
    '{milestones: $m, closed_issues: $c}'
}

fetch_milestones() {
  local since="$1" repo
  inbox_repos | while read -r repo; do
    fetch_repo_milestones "$repo" "$since"
  done | jq -s '{milestones: (map(.milestones) | add // []),
                 closed_issues: (map(.closed_issues) | add // [])}' | rollup_milestones
}

fetch_events() {
  local since="$1" include="$2"
  if [[ "$include" != "true" ]]; then
    echo '[]'
    return
  fi
  gh_api_all "users/$LOGIN/events?per_page=100" | filter_events "$since"
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
    --argjson milestones "$(fetch_milestones "$since")" \
    '{window: {since: $since, now: $now, events_included: $include_events,
               limit: $limit, truncated: $truncated},
      repos: $repos,
      milestones: $milestones,
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
