#!/usr/bin/env bats
# shellcheck shell=bash
# shellcheck disable=SC1090  # SCRIPT is dynamic; sourcing the unit under test is the pattern
bats_require_minimum_version 1.5.0

setup() {
  SCRIPT="$BATS_TEST_DIRNAME/collect.sh"
}

# --- Cadence grammar ---

@test "valid cadence: 7d resolves" {
  source "$SCRIPT"
  run resolve_since 7d
  [ "$status" -eq 0 ]
  [[ "$output" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]
}

@test "valid cadence: 4w resolves" {
  source "$SCRIPT"
  run resolve_since 4w
  [ "$status" -eq 0 ]
}

@test "valid cadence: 6m resolves" {
  source "$SCRIPT"
  run resolve_since 6m
  [ "$status" -eq 0 ]
}

@test "valid cadence: 1y resolves" {
  source "$SCRIPT"
  run resolve_since 1y
  [ "$status" -eq 0 ]
}

@test "invalid cadence: foo rejected with grammar message" {
  source "$SCRIPT"
  run resolve_since foo
  [ "$status" -eq 2 ]
  [[ "$output" == *"invalid cadence"* ]]
  [[ "$output" == *"Nd | Nw | Nm | Ny"* ]]
}

@test "invalid cadence: empty string rejected" {
  source "$SCRIPT"
  run resolve_since ""
  [ "$status" -eq 2 ]
}

@test "invalid cadence: 0d rejected (must be 1+)" {
  source "$SCRIPT"
  run resolve_since 0d
  [ "$status" -eq 2 ]
}

@test "invalid cadence: 7days rejected" {
  source "$SCRIPT"
  run resolve_since 7days
  [ "$status" -eq 2 ]
}

@test "invalid cadence: last rejected (state file dropped)" {
  source "$SCRIPT"
  run resolve_since last
  [ "$status" -eq 2 ]
  [[ "$output" == *"invalid cadence"* ]]
}

# --- filter_commits heuristics ---

@test "filter_commits drops squash-merge PR subject" {
  source "$SCRIPT"
  result=$(echo '[{"repository":{"fullName":"a/b"},"sha":"abc1234","commit":{"message":"feat: thing (#42)","author":{"date":"2026-04-26T00:00:00Z"}}}]' | filter_commits)
  [ "$(jq 'length' <<<"$result")" -eq 0 ]
}

@test "filter_commits keeps direct-to-trunk commit (no PR suffix)" {
  source "$SCRIPT"
  result=$(echo '[{"repository":{"fullName":"a/b"},"sha":"abc1234","commit":{"message":"direct work on trunk","author":{"date":"2026-04-26T00:00:00Z"}}}]' | filter_commits)
  [ "$(jq 'length' <<<"$result")" -eq 1 ]
}

@test "filter_commits drops commits in sync-noise repo" {
  source "$SCRIPT"
  result=$(echo '[{"repository":{"fullName":"alunduil/alunduil-claustre-state"},"sha":"abc1234","commit":{"message":"anything","author":{"date":"2026-04-26T00:00:00Z"}}}]' | filter_commits)
  [ "$(jq 'length' <<<"$result")" -eq 0 ]
}

@test "filter_commits drops sync: subject prefix" {
  source "$SCRIPT"
  result=$(echo '[{"repository":{"fullName":"a/b"},"sha":"abc1234","commit":{"message":"sync: penguin at 2026-04-27","author":{"date":"2026-04-26T00:00:00Z"}}}]' | filter_commits)
  [ "$(jq 'length' <<<"$result")" -eq 0 ]
}

@test "filter_commits projects subject (first line of message only)" {
  source "$SCRIPT"
  # JSON \n is interpreted by jq as a real newline, so split("\n") works.
  result=$(printf '%s' '[{"repository":{"fullName":"a/b"},"sha":"abc1234567","commit":{"message":"subject line\n\nbody paragraph that should be dropped","author":{"date":"2026-04-26T00:00:00Z"}}}]' | filter_commits)
  [ "$(jq -r '.[0].subject' <<<"$result")" = "subject line" ]
  [ "$(jq -r '.[0].sha' <<<"$result")" = "abc1234" ]
}

# --- filter_events heuristics ---

@test "filter_events drops task/* CreateEvent" {
  source "$SCRIPT"
  result=$(echo '[{"type":"CreateEvent","created_at":"2026-04-30T00:00:00Z","repo":{"name":"a/b"},"payload":{"ref":"task/work-on-something","ref_type":"branch"}}]' | filter_events 2026-04-26)
  [ "$(jq 'length' <<<"$result")" -eq 0 ]
}

@test "filter_events drops release-please-- CreateEvent" {
  source "$SCRIPT"
  result=$(echo '[{"type":"CreateEvent","created_at":"2026-04-30T00:00:00Z","repo":{"name":"a/b"},"payload":{"ref":"release-please--branches--main","ref_type":"branch"}}]' | filter_events 2026-04-26)
  [ "$(jq 'length' <<<"$result")" -eq 0 ]
}

@test "filter_events keeps non-task branch CreateEvent" {
  source "$SCRIPT"
  result=$(echo '[{"type":"CreateEvent","created_at":"2026-04-30T00:00:00Z","repo":{"name":"a/b"},"payload":{"ref":"main","ref_type":"branch"}}]' | filter_events 2026-04-26)
  [ "$(jq 'length' <<<"$result")" -eq 1 ]
}

@test "filter_events keeps WatchEvent (star)" {
  source "$SCRIPT"
  result=$(echo '[{"type":"WatchEvent","created_at":"2026-04-30T00:00:00Z","repo":{"name":"a/b"},"payload":{}}]' | filter_events 2026-04-26)
  [ "$(jq 'length' <<<"$result")" -eq 1 ]
}

@test "filter_events excludes events before SINCE" {
  source "$SCRIPT"
  result=$(echo '[{"type":"WatchEvent","created_at":"2026-04-20T00:00:00Z","repo":{"name":"a/b"},"payload":{}}]' | filter_events 2026-04-26)
  [ "$(jq 'length' <<<"$result")" -eq 0 ]
}

@test "filter_events drops event types already covered by search (e.g. PushEvent)" {
  source "$SCRIPT"
  result=$(echo '[{"type":"PushEvent","created_at":"2026-04-30T00:00:00Z","repo":{"name":"a/b"},"payload":{}}]' | filter_events 2026-04-26)
  [ "$(jq 'length' <<<"$result")" -eq 0 ]
}

# --- URL → repo parsing ---

@test "filter_prs_opened parses repo from URL" {
  source "$SCRIPT"
  result=$(echo '[{"number":42,"title":"x","state":"open","url":"https://github.com/owner/repo/pull/42","createdAt":"2026-04-26T00:00:00Z"}]' | filter_prs_opened)
  [ "$(jq -r '.[0].repo' <<<"$result")" = "owner/repo" ]
}

@test "filter_issues_opened parses repo from URL" {
  source "$SCRIPT"
  result=$(echo '[{"number":7,"title":"x","state":"open","url":"https://github.com/owner/repo/issues/7","createdAt":"2026-04-26T00:00:00Z"}]' | filter_issues_opened)
  [ "$(jq -r '.[0].repo' <<<"$result")" = "owner/repo" ]
}

@test "filter_issues_closed projects closedAt and parses repo from URL" {
  source "$SCRIPT"
  result=$(echo '[{"number":7,"title":"x","state":"closed","url":"https://github.com/owner/repo/issues/7","closedAt":"2026-04-30T12:00:00Z"}]' | filter_issues_closed)
  [ "$(jq -r '.[0].repo' <<<"$result")" = "owner/repo" ]
  [ "$(jq -r '.[0].closedAt' <<<"$result")" = "2026-04-30T12:00:00Z" ]
}

# --- truncation detection ---

@test "detect_truncated lists keys whose count saturated the limit" {
  source "$SCRIPT"
  input='{"commits":300,"prs_opened":50,"issues_opened":300,"issues_closed":42}'
  result=$(echo "$input" | detect_truncated)
  [ "$(jq 'length' <<<"$result")" -eq 2 ]
  [ "$(jq -r '.[0]' <<<"$result")" = "commits" ]
  [ "$(jq -r '.[1]' <<<"$result")" = "issues_opened" ]
}

@test "detect_truncated returns empty array when nothing saturated" {
  source "$SCRIPT"
  result=$(echo '{"commits":9,"prs_opened":83,"issues_opened":100}' | detect_truncated)
  [ "$(jq 'length' <<<"$result")" -eq 0 ]
}

@test "detect_truncated treats counts above the limit as truncated too" {
  source "$SCRIPT"
  result=$(echo '{"commits":350}' | detect_truncated)
  [ "$(jq -r '.[0]' <<<"$result")" = "commits" ]
}

# --- per-repo rollup ---

@test "rollup_repos returns empty object on empty input" {
  source "$SCRIPT"
  result=$(echo '{"commits":[],"prs_opened":[],"prs_reviewed":[],"issues_opened":[],"issues_closed":[],"commented":[]}' | rollup_repos)
  [ "$(jq 'length' <<<"$result")" -eq 0 ]
}

@test "rollup_repos counts a single commit and records day_active" {
  source "$SCRIPT"
  input='{"commits":[{"repo":"a/b","sha":"abc1234","subject":"x","date":"2026-04-27T22:00:00Z"}],"prs_opened":[],"prs_reviewed":[],"issues_opened":[],"issues_closed":[],"commented":[]}'
  result=$(echo "$input" | rollup_repos)
  [ "$(jq -r '."a/b".commits' <<<"$result")" = "1" ]
  [ "$(jq -r '."a/b".days_active[0]' <<<"$result")" = "2026-04-27" ]
}

@test "rollup_repos sums across sources and unions days for one repo" {
  source "$SCRIPT"
  input='{
    "commits":[{"repo":"a/b","sha":"x","subject":"y","date":"2026-04-27T10:00:00Z"}],
    "prs_opened":[{"repo":"a/b","n":1,"title":"x","state":"open","url":"https://github.com/a/b/pull/1","createdAt":"2026-04-28T10:00:00Z"}],
    "prs_reviewed":[],
    "issues_opened":[{"repo":"a/b","n":2,"title":"x","state":"open","url":"https://github.com/a/b/issues/2","createdAt":"2026-04-27T11:00:00Z"}],
    "issues_closed":[],
    "commented":[]
  }'
  result=$(echo "$input" | rollup_repos)
  [ "$(jq -r '."a/b".commits' <<<"$result")" = "1" ]
  [ "$(jq -r '."a/b".prs_opened' <<<"$result")" = "1" ]
  [ "$(jq -r '."a/b".issues_opened' <<<"$result")" = "1" ]
  # Same-day items collapse; days_active sorted ascending.
  [ "$(jq -r '."a/b".days_active | length' <<<"$result")" -eq 2 ]
  [ "$(jq -r '."a/b".days_active[0]' <<<"$result")" = "2026-04-27" ]
  [ "$(jq -r '."a/b".days_active[1]' <<<"$result")" = "2026-04-28" ]
}

@test "rollup_repos splits across multiple repos" {
  source "$SCRIPT"
  input='{
    "commits":[
      {"repo":"a/b","sha":"x","subject":"y","date":"2026-04-27T10:00:00Z"},
      {"repo":"c/d","sha":"x","subject":"y","date":"2026-04-30T10:00:00Z"}
    ],
    "prs_opened":[],"prs_reviewed":[],"issues_opened":[],"issues_closed":[],"commented":[]
  }'
  result=$(echo "$input" | rollup_repos)
  [ "$(jq 'length' <<<"$result")" -eq 2 ]
  [ "$(jq -r '."a/b".commits' <<<"$result")" = "1" ]
  [ "$(jq -r '."c/d".commits' <<<"$result")" = "1" ]
}

@test "rollup_repos drops items missing repo or date" {
  source "$SCRIPT"
  input='{
    "commits":[
      {"repo":null,"sha":"x","subject":"y","date":"2026-04-27T10:00:00Z"},
      {"repo":"a/b","sha":"x","subject":"y","date":null}
    ],
    "prs_opened":[],"prs_reviewed":[],"issues_opened":[],"issues_closed":[],"commented":[]
  }'
  result=$(echo "$input" | rollup_repos)
  [ "$(jq 'length' <<<"$result")" -eq 0 ]
}
