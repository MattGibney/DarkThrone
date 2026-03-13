#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=../dev-lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/../dev-lib.sh"

repo_root="$REPO_ROOT"

usage() {
  cat <<EOF
Usage: ${DEV_CMD:-./tools/dev repair}

Repair common local environment issues without a full down/up cycle.

Actions performed:
  1. Flush macOS DNS cache (requires sudo)
  2. Regenerate and reload Caddy reverse-proxy routes
  3. Check DNS resolution for local domains
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

echo "==> Flushing DNS cache..."
if [[ "$(uname)" == "Darwin" ]]; then
  sudo dscacheutil -flushcache
  sudo killall -HUP mDNSResponder 2>/dev/null || true
  echo "    DNS cache flushed."
else
  echo "    Skipped (not macOS)."
fi

echo
echo "==> Regenerating Caddy routes..."
bash "${repo_root}/tools/dev.d/caddy.sh"

echo
echo "Repair complete."
