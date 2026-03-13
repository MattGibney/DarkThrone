#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=../dev-lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/../dev-lib.sh"

repo_root="$REPO_ROOT"

usage() {
  cat <<EOF
Usage: ${DEV_CMD:-$0} [env-id]

Tears down a development environment: stops Docker containers, removes volumes,
restores previous local env files, deletes generated data, and updates Caddy routes.
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

env_id="${1:-}"
if [[ -z "$env_id" ]]; then
  env_id="$(derive_env_id)"
fi

if [[ -z "$env_id" ]]; then
  echo "Unable to determine environment ID automatically."
  echo "Run again with an explicit env ID (for example: ${DEV_CMD:-$0} dev)."
  exit 1
fi

compose_project="dt-$(slugify_lower "$env_id")"
data_dir="${repo_root}/.data/${env_id}"

restore_env_file() {
  local file="$1"
  local backup="${file}.worktree-backup"

  if [[ -f "$backup" ]]; then
    mv "$backup" "$file"
    echo "  restored ${file#"${repo_root}/"}"
  elif [[ -f "$file" ]]; then
    rm -f "$file"
    echo "  removed ${file#"${repo_root}/"}"
  fi
}

echo "Tearing down development environment: ${env_id}"
echo "  Docker project: ${compose_project}"
echo "  Data directory: ${data_dir}"
echo

if docker info >/dev/null 2>&1; then
  compose_cmd="$(resolve_compose)"
  if [[ -n "$compose_cmd" ]]; then
    echo "Stopping Docker containers and removing volumes..."
    $compose_cmd -f "${repo_root}/docker-compose.dev.yml" -p "$compose_project" down -v 2>/dev/null || true
  else
    echo "Docker Compose not found. Skipping container teardown."
  fi
else
  echo "Docker daemon not available. Skipping container teardown."
fi

if [[ -d "$data_dir" ]]; then
  echo "Removing data directory: ${data_dir}"
  rm -rf "$data_dir"
fi

echo "Restoring local env files..."
restore_env_file "${repo_root}/apps/api/.env.local"
restore_env_file "${repo_root}/apps/api/.env.test.local"
restore_env_file "${repo_root}/apps/web-app/.env.local"
restore_env_file "${repo_root}/apps/website/.env.local"

if [[ -f "${repo_root}/.env.dev" ]]; then
  rm -f "${repo_root}/.env.dev"
  echo "  removed .env.dev"
fi

echo "Updating Caddy routes..."
"${TOOLS_DIR}/dev.d/caddy.sh" || true

echo "Resetting Nx cache..."
npx nx reset 2>/dev/null || true

echo
echo "Teardown complete for ${env_id}."
