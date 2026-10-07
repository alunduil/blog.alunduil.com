#!/usr/bin/env bash
set -euo pipefail

# Assert each custom Vale rule against its fixtures in
# .vale/fixtures/blog-alunduil-com/:
# every line of <Rule>.flag.md must draw exactly one alert, and
# <Rule>.pass.md must draw none.

cd "$(git rev-parse --show-toplevel)"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

failed=0

# Enables blog-alunduil-com.<rule> alone so other styles' alerts don't count
# against it.
config_for() {
  local rule=$1 config="$tmp/$1.ini"
  cat >"$config" <<EOF
StylesPath = $PWD/.vale/styles
Vocab = blog-alunduil-com
[*.md]
blog-alunduil-com.$rule = YES
EOF
  echo "$config"
}

lint() {
  local config=$1 file=$2 status=0
  vale --config="$config" --output=line "$file" || status=$?
  # 1 means alerts were found; anything higher is a Vale runtime error.
  if ((status > 1)); then
    echo "vale failed on $file" >&2
    exit "$status"
  fi
}

for rule_file in .vale/styles/blog-alunduil-com/*.yml; do
  rule=$(basename "$rule_file" .yml)
  flag_file=".vale/fixtures/blog-alunduil-com/$rule.flag.md"
  pass_file=".vale/fixtures/blog-alunduil-com/$rule.pass.md"

  # Vale lints a missing path as literal text, which would pass silently.
  if [[ ! -f "$flag_file" || ! -f "$pass_file" ]]; then
    echo "blog-alunduil-com.$rule: needs $flag_file and $pass_file" >&2
    failed=1
    continue
  fi

  config=$(config_for "$rule")

  expected=$(grep -n . "$flag_file" | cut -d: -f1)
  actual=$(lint "$config" "$flag_file" | cut -d: -f2)
  if [[ "$expected" != "$actual" ]]; then
    echo "blog-alunduil-com.$rule: lines of $flag_file that must flag once:" >&2
    diff <(echo "$expected") <(echo "$actual") | grep '^[<>]' >&2 || true
    failed=1
  fi

  hits=$(lint "$config" "$pass_file")
  if [[ -n "$hits" ]]; then
    echo "blog-alunduil-com.$rule: $pass_file must not flag:" >&2
    echo "$hits" >&2
    failed=1
  fi
done

exit "$failed"
