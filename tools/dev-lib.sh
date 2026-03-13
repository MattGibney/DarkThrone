#!/usr/bin/env bash
# Shared helpers for tools/dev and tools/dev.d/* scripts.
# Source this file; do not execute it directly.

resolve_repo_root() {
  git -C "$(dirname "${BASH_SOURCE[0]}")/.." rev-parse --show-toplevel
}

REPO_ROOT="${REPO_ROOT:-$(resolve_repo_root)}"
TOOLS_DIR="${REPO_ROOT}/tools"

slugify_lower() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9_-]+/-/g; s/^-+//; s/-+$//'
}

resolve_compose() {
  if docker compose version >/dev/null 2>&1; then
    echo "docker compose"
  elif command -v docker-compose >/dev/null 2>&1; then
    echo "docker-compose"
  else
    echo ""
  fi
}

wait_for_docker() {
  local retries="${1:-60}"

  if docker info >/dev/null 2>&1; then
    return 0
  fi

  if command -v colima >/dev/null 2>&1 && ! colima status >/dev/null 2>&1; then
    echo "Colima detected but not running, starting it..."
    colima start
  elif [[ "$(uname)" == "Darwin" ]] && ! command -v colima >/dev/null 2>&1; then
    echo "Docker is not reachable. Start Docker Desktop or Colima first."
  fi

  for _ in $(seq 1 "$retries"); do
    if docker info >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done

  echo "Timed out waiting for Docker."
  return 1
}

wait_for_port() {
  local host="$1"
  local port="$2"
  local label="$3"
  local retries="${4:-120}"

  for _ in $(seq 1 "$retries"); do
    if (echo >/dev/tcp/"$host"/"$port") >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done

  echo "Timed out waiting for ${label} (${host}:${port})."
  return 1
}

read_env_value() {
  local file="$1"
  local key="$2"
  awk -F'=' -v key="$key" '$1 == key { print substr($0, index($0, "=") + 1); exit }' "$file"
}

contains() {
  local needle="$1"
  shift

  local item
  for item in "$@"; do
    if [[ "$item" == "$needle" ]]; then
      return 0
    fi
  done

  return 1
}

derive_work_id_from_path() {
  local path="$1"
  local main_worktree="$2"
  local main_repo_name="$3"

  if [[ "$path" == "$main_worktree" ]]; then
    echo ""
    return
  fi

  local current_name parent_dir
  current_name="$(basename "$path")"
  if [[ -n "$current_name" && "$current_name" != "$main_repo_name" ]]; then
    echo "$current_name"
    return
  fi

  parent_dir="$(basename "$(dirname "$path")")"
  if [[ -n "$parent_dir" && "$parent_dir" != "." && "$parent_dir" != "$current_name" ]]; then
    echo "$parent_dir"
    return
  fi

  echo ""
}

derive_env_id() {
  local repo_root="${1:-$REPO_ROOT}"

  if [[ -f "${repo_root}/.env.dev" ]]; then
    local existing_id
    existing_id="$(read_env_value "${repo_root}/.env.dev" WORK_ID || true)"
    if [[ -n "$existing_id" ]]; then
      echo "$existing_id"
      return
    fi
  fi

  local main_worktree main_repo_name derived
  main_worktree="$(git -C "$repo_root" worktree list --porcelain | awk '/^worktree /{print $2; exit}')"
  main_repo_name="$(basename "$main_worktree")"
  derived="$(derive_work_id_from_path "$repo_root" "$main_worktree" "$main_repo_name")"
  if [[ -n "$derived" ]]; then
    echo "$derived"
    return
  fi

  local env_dirs=()
  if [[ -d "${repo_root}/.data" ]]; then
    for env_file in "${repo_root}"/.data/*/.env.dev; do
      [[ -f "$env_file" ]] || continue
      env_dirs+=("$(basename "$(dirname "$env_file")")")
    done
  fi

  if [[ "${#env_dirs[@]}" -eq 1 ]]; then
    echo "${env_dirs[0]}"
    return
  fi

  echo ""
}

collect_worktree_paths() {
  local repo_root="${1:-$REPO_ROOT}"

  git -C "$repo_root" worktree list --porcelain | awk '/^worktree /{print $2}'
}

collect_env_files() {
  local repo_root="${1:-$REPO_ROOT}"
  local worktree_path

  while IFS= read -r worktree_path; do
    [[ -n "$worktree_path" ]] || continue

    if [[ -f "${worktree_path}/.env.dev" ]]; then
      printf '%s\n' "${worktree_path}/.env.dev"
    fi

    if [[ -d "${worktree_path}/.data" ]]; then
      find "${worktree_path}/.data" -mindepth 2 -maxdepth 2 -name '.env.dev' -print 2>/dev/null
    fi
  done < <(collect_worktree_paths "$repo_root")
}

check_dns() {
  local domain_base="${LOCAL_DOMAIN_BASE:-darkthrone.test}"
  local work_id="${1:-${WORK_ID:-}}"

  if [[ -z "$work_id" || "$(uname)" != "Darwin" ]]; then
    return
  fi

  local test_host resolved
  test_host="$(slugify_lower "$work_id").${domain_base}"
  resolved="$(dscacheutil -q host -a name "$test_host" 2>/dev/null | awk '/^ip_address:/{print $2; exit}')"

  if [[ -z "$resolved" ]]; then
    echo
    echo "WARNING: DNS is not resolving ${test_host}."
    echo "  Ensure dnsmasq is configured for ${domain_base}."
    echo "  See: tools/dev.d/LOCAL_DOMAINS.md"
  else
    echo "Local domains OK (${test_host} -> ${resolved})"
  fi
}
