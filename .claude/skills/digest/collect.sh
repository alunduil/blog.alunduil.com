#!/usr/bin/env bash
# /digest data collector. Fans out GitHub queries, applies heuristic
# filters, and emits structured JSON to stdout.
#
# Usage: collect.sh [cadence]
# Cadence: last (default) | Nd | Nw | Nm | Ny

set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
LAST_RUN_FILE="$SCRIPT_DIR/last-run"
LOGIN=alunduil

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
    last)
      if [[ -s "$LAST_RUN_FILE" ]]; then
        date -d "$(head -n 1 "$LAST_RUN_FILE")" -u +%Y-%m-%d
      else
        echo "warn: $LAST_RUN_FILE empty; falling back to 1w" >&2
        date -d "1 week ago" -u +%Y-%m-%d
      fi
      ;;
    [1-9]*[0-9]*d | [1-9]d) date -d "${cadence%d} days ago" -u +%Y-%m-%d ;;
    [1-9]*[0-9]*w | [1-9]w) date -d "${cadence%w} weeks ago" -u +%Y-%m-%d ;;
    [1-9]*[0-9]*m | [1-9]m) date -d "${cadence%m} months ago" -u +%Y-%m-%d ;;
    [1-9]*[0-9]*y | [1-9]y) date -d "${cadence%y} years ago" -u +%Y-%m-%d ;;
    *)
      echo "error: invalid cadence '$cadence'. Expected: last | Nd | Nw | Nm | Ny" >&2
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

fetch_commits() {
  gh search commits --author=@me --author-date=">$1" --limit 100 \
    --json repository,sha,commit 2>/dev/null | filter_commits
}

fetch_prs_opened() {
  gh search prs --author=@me --created=">$1" --limit 100 \
    --json number,title,state,url,createdAt 2>/dev/null | filter_prs_opened
}

fetch_prs_reviewed() {
  gh search prs --reviewed-by=@me --updated=">$1" --limit 100 \
    --json number,title,url,author,updatedAt 2>/dev/null | filter_prs_reviewed
}

fetch_issues_opened() {
  gh search issues --author=@me --created=">$1" --limit 100 \
    --json number,title,state,url,createdAt 2>/dev/null | filter_issues_opened
}

fetch_commented() {
  gh search issues --commenter=@me --updated=">$1" --limit 100 \
    --json number,title,url,updatedAt 2>/dev/null | filter_commented
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
  local cadence="${1:-last}"
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

  jq -n \
    --arg since "$since" \
    --arg now "$now" \
    --argjson include_events "$include_events" \
    --argjson commits "$(fetch_commits "$since")" \
    --argjson prs_opened "$(fetch_prs_opened "$since")" \
    --argjson prs_reviewed "$(fetch_prs_reviewed "$since")" \
    --argjson issues_opened "$(fetch_issues_opened "$since")" \
    --argjson commented "$(fetch_commented "$since")" \
    --argjson events "$(fetch_events "$since" "$include_events")" \
    '{window: {since: $since, now: $now, events_included: $include_events},
      commits: $commits,
      prs_opened: $prs_opened,
      prs_reviewed: $prs_reviewed,
      issues_opened: $issues_opened,
      commented: $commented,
      events: $events}'
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main "$@"
fi
