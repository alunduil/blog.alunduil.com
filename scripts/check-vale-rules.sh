#!/usr/bin/env bash
set -euo pipefail

# Assert each custom Vale rule against its fixtures in .vale/fixtures/Custom/:
# every line of <Rule>.flag.md must draw exactly one alert, and
# <Rule>.pass.md must draw none. Each rule runs alone so other styles' alerts
# don't count against it.

root=$(git rev-parse --show-toplevel)
fixtures="$root/.vale/fixtures/Custom"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

failed=0

lint() {
  local config=$1 file=$2 status=0
  vale --config="$config" --output=line "$file" || status=$?
  # 1 means alerts were found; anything higher is a Vale runtime error.
  if ((status > 1)); then
    echo "vale failed on $file" >&2
    exit "$status"
  fi
}

for flag in "$fixtures"/*.flag.md; do
  rule=$(basename "$flag" .flag.md)
  pass="$fixtures/$rule.pass.md"
  config="$tmp/$rule.ini"

  cat >"$config" <<EOF
StylesPath = $root/.vale/styles
Vocab = Custom
[*.md]
Custom.$rule = YES
EOF

  expected=$(grep -n . "$flag" | cut -d: -f1)
  actual=$(lint "$config" "$flag" | cut -d: -f2)
  if [[ "$expected" != "$actual" ]]; then
    echo "Custom.$rule: lines of ${flag#"$root"/} that must flag once:" >&2
    diff <(echo "$expected") <(echo "$actual") | grep '^[<>]' >&2 || true
    failed=1
  fi

  hits=$(lint "$config" "$pass")
  if [[ -n "$hits" ]]; then
    echo "Custom.$rule: ${pass#"$root"/} must not flag:" >&2
    echo "${hits//"$root"\//}" >&2
    failed=1
  fi
done

exit "$failed"
