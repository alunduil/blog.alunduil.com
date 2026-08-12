#!/usr/bin/env bash
set -euo pipefail

# Provision the lychee binary the pre-commit link-check hook runs. Called by
# .github/workflows/pre-commit.yml; safe to run by hand on a checkout that
# doesn't already have lychee on PATH.

# renovate: datasource=github-releases depName=lycheeverse/lychee extractVersion=^lychee-(?<version>v[\d.]+)$
LYCHEE_VERSION="v0.24.2"

# The musl build is statically linked, so the same binary runs on the CI
# runner and on Debian-based images whose GLIBC is older than the GNU build
# demands.
ARCH="x86_64-unknown-linux-musl"

ASSET="lychee-${ARCH}.tar.gz"
BASE="https://github.com/lycheeverse/lychee/releases/download/lychee-${LYCHEE_VERSION}"
BIN_DIR="${HOME}/.local/bin"

tmp="$(mktemp -d)"
trap 'rm -rf "${tmp}"' EXIT

# --retry alone covers transient HTTP status codes; --retry-all-errors is what
# covers transport-level failures such as a mid-transfer connection reset.
curl_get() {
  curl -fsSL --retry 5 --retry-delay 2 --retry-all-errors --connect-timeout 10 \
    -o "${tmp}/$1" "${BASE}/$1"
}

curl_get "${ASSET}"
curl_get "${ASSET}.sha256"
(cd "${tmp}" && sha256sum --check --status "${ASSET}.sha256")

# The tarball nests its contents under a target-named directory.
tar -xzf "${tmp}/${ASSET}" -C "${tmp}" "lychee-${ARCH}/lychee"
mkdir -p "${BIN_DIR}"
install -m 0755 "${tmp}/lychee-${ARCH}/lychee" "${BIN_DIR}/lychee"

# Later steps in the same job resolve `lychee` from PATH.
if [[ -n "${GITHUB_ACTIONS:-}" ]]; then
  echo "${BIN_DIR}" >>"${GITHUB_PATH}"
fi

"${BIN_DIR}/lychee" --version
