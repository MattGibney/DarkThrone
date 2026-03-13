#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=../dev-lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/../dev-lib.sh"

repo_root="$REPO_ROOT"

usage() {
  cat <<EOF
Usage: ${DEV_CMD:-$0} [--yes]

Find Docker Compose projects tied to DarkThrone worktrees that no longer map to
live git worktrees. By default it prompts before removing anything.
EOF
}

list_compose_projects() {
  {
    docker ps -a --filter label=com.docker.compose.project --format '{{.Label "com.docker.compose.project"}}'
    docker network ls --filter label=com.docker.compose.project --format '{{.Label "com.docker.compose.project"}}'
    docker volume ls --filter label=com.docker.compose.project --format '{{.Label "com.docker.compose.project"}}'
  } | awk 'NF { print }' | sort -u
}

remove_compose_project_resources() {
  local project="$1"

  local container_ids=()
  local network_ids=()
  local volume_ids=()

  while IFS= read -r id; do
    [[ -n "$id" ]] && container_ids+=("$id")
  done < <(docker ps -aq --filter "label=com.docker.compose.project=${project}")

  while IFS= read -r id; do
    [[ -n "$id" ]] && network_ids+=("$id")
  done < <(docker network ls -q --filter "label=com.docker.compose.project=${project}")

  while IFS= read -r id; do
    [[ -n "$id" ]] && volume_ids+=("$id")
  done < <(docker volume ls -q --filter "label=com.docker.compose.project=${project}")

  if [[ "${#container_ids[@]}" -gt 0 ]]; then
    docker rm -f "${container_ids[@]}"
  fi
  if [[ "${#network_ids[@]}" -gt 0 ]]; then
    docker network rm "${network_ids[@]}"
  fi
  if [[ "${#volume_ids[@]}" -gt 0 ]]; then
    docker volume rm "${volume_ids[@]}"
  fi
}

auto_confirm=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    -y|--yes) auto_confirm=true ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1"; usage; exit 1 ;;
  esac
  shift
done

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed or not on PATH."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker daemon is not available."
  exit 1
fi

worktree_paths=()
while IFS= read -r worktree_path; do
  [[ -n "$worktree_path" ]] && worktree_paths+=("$worktree_path")
done < <(collect_worktree_paths "$repo_root")

if [[ "${#worktree_paths[@]}" -eq 0 ]]; then
  echo "No git worktrees found."
  exit 1
fi

main_worktree="${worktree_paths[0]}"
main_repo_name="$(basename "$main_worktree")"

active_projects=()
for worktree_path in "${worktree_paths[@]}"; do
  env_file="${worktree_path}/.env.dev"
  work_id=""

  if [[ -f "$env_file" ]]; then
    work_id="$(read_env_value "$env_file" "WORK_ID" || true)"
  fi

  if [[ -z "$work_id" ]]; then
    work_id="$(derive_work_id_from_path "$worktree_path" "$main_worktree" "$main_repo_name")"
  fi

  if [[ -n "$work_id" ]]; then
    active_projects+=("dt-$(slugify_lower "$work_id")")
  fi
done

dead_projects=()
while IFS= read -r project; do
  [[ -z "$project" || "$project" != dt-* ]] && continue
  if ! contains "$project" "${active_projects[@]+"${active_projects[@]}"}"; then
    dead_projects+=("$project")
  fi
done < <(list_compose_projects)

if [[ "${#dead_projects[@]}" -eq 0 ]]; then
  echo "No orphaned DarkThrone Docker Compose projects found."
  exit 0
fi

echo "Orphaned Docker Compose projects:"
for project in "${dead_projects[@]}"; do
  echo "  - ${project}"
done

if [[ "$auto_confirm" != true ]]; then
  read -r -p "Remove these projects? [y/N] " answer
  case "$answer" in
    y|Y|yes|YES) ;;
    *) echo "No projects were removed."; exit 0 ;;
  esac
fi

for project in "${dead_projects[@]}"; do
  echo "Removing ${project}..."
  remove_compose_project_resources "$project"
done

echo "Removed ${#dead_projects[@]} orphaned project(s)."
