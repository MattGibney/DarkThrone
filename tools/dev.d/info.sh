#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=../dev-lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/../dev-lib.sh"

repo_root="$REPO_ROOT"

if [[ -t 1 ]]; then
  BOLD='\033[1m'
  DIM='\033[2m'
  GREEN='\033[32m'
  RED='\033[31m'
  YELLOW='\033[33m'
  CYAN='\033[36m'
  RESET='\033[0m'
else
  BOLD='' DIM='' GREEN='' RED='' YELLOW='' CYAN='' RESET=''
fi

status_badge() {
  local status="$1"
  case "$status" in
    up|running|healthy)
      printf "${GREEN}● up${RESET}"
      ;;
    partial)
      printf "${YELLOW}◐ partial${RESET}"
      ;;
    *)
      printf "${RED}○ down${RESET}"
      ;;
  esac
}

usage() {
  cat <<EOF
Usage: ${DEV_CMD:-$0} [env-id]

Shows the current state of the development environment: worktree info,
Docker service status, app URLs, and database connection parameters.
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

resolve_env() {
  local target_id="$1"
  local worktree_path env_file env_work_id

  while IFS= read -r worktree_path; do
    [[ -n "$worktree_path" ]] || continue

    env_file="${worktree_path}/.env.dev"
    if [[ -f "$env_file" ]]; then
      env_work_id="$(read_env_value "$env_file" WORK_ID || true)"
      if [[ "$env_work_id" == "$target_id" ]]; then
        echo "${worktree_path}|${env_file}"
        return
      fi
    fi

    env_file="${worktree_path}/.data/${target_id}/.env.dev"
    if [[ -f "$env_file" ]]; then
      echo "${worktree_path}|${env_file}"
      return
    fi
  done < <(collect_worktree_paths "$repo_root")

  echo ""
}

resolved="$(resolve_env "$env_id")"
if [[ -z "$resolved" ]]; then
  echo "No .env.dev found for environment '${env_id}'."
  echo "Run: ./tools/dev up ${env_id}"
  exit 1
fi

env_root="${resolved%%|*}"
env_file="${resolved#*|}"

set -a
# shellcheck disable=SC1090
source "$env_file"
set +a

branch="$(git -C "$env_root" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")"
compose_project="${COMPOSE_PROJECT:-dt-$(slugify_lower "$env_id")}"

echo
echo -e "${BOLD}Development Environment: ${CYAN}${env_id}${RESET}"
echo -e "${DIM}────────────────────────────────────────${RESET}"
echo

echo -e "${BOLD}Worktree${RESET}"
echo -e "  Branch:    ${CYAN}${branch}${RESET}"
echo -e "  Root:      ${DIM}${env_root}${RESET}"
echo -e "  Data:      ${DIM}${DATA_ROOT:-${env_root}/.data/${env_id}}${RESET}"
echo

echo -e "${BOLD}Docker Services${RESET} ${DIM}(project: ${compose_project})${RESET}"
if docker info >/dev/null 2>&1; then
  compose_cmd="$(resolve_compose)"
  if [[ -n "$compose_cmd" ]]; then
    containers="$($compose_cmd -f "${env_root}/docker-compose.dev.yml" -p "$compose_project" ps --format '{{.Name}}|{{.Status}}' 2>/dev/null || true)"
    if [[ -n "$containers" ]]; then
      while IFS='|' read -r name status; do
        short_name="${name#"${compose_project}-"}"
        short_name="${short_name%-1}"
        if echo "$status" | grep -qi 'up\|running\|healthy'; then
          echo -e "  $(status_badge up)  ${short_name} ${DIM}${status}${RESET}"
        else
          echo -e "  $(status_badge down)  ${short_name} ${DIM}${status}${RESET}"
        fi
      done <<< "$containers"
    else
      echo -e "  ${RED}No containers found${RESET}"
    fi
  else
    echo -e "  ${RED}Docker Compose not available${RESET}"
  fi
else
  echo -e "  ${RED}Docker daemon not available${RESET}"
fi
echo

echo -e "${BOLD}App Processes${RESET}"
check_app_port() {
  local label="$1"
  local port="$2"
  if [[ -z "$port" ]]; then
    echo -e "  ${DIM}○${RESET}  ${label} ${DIM}not configured${RESET}"
    return
  fi
  if lsof -nP -iTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; then
    echo -e "  $(status_badge up)  ${label} ${DIM}:${port}${RESET}"
  else
    echo -e "  $(status_badge down)  ${label} ${DIM}:${port}${RESET}"
  fi
}

check_app_port "API" "${API_PORT:-}"
check_app_port "Web App" "${WEB_APP_PORT:-}"
check_app_port "Website" "${WEBSITE_PORT:-}"
echo

echo -e "${BOLD}URLs${RESET}"
echo -e "  Web App:   ${CYAN}${WEB_APP_URL:-}${RESET}"
echo -e "  API:       ${CYAN}${API_URL:-}${RESET}"
echo -e "  Website:   ${CYAN}${WEBSITE_URL:-}${RESET}"
echo

if [[ -n "${PG_PORT:-}" ]]; then
  echo -e "${BOLD}Database${RESET}"
  echo -e "  Postgres:  ${CYAN}postgresql://${PG_USER:-darkthrone}:${PG_PASSWORD:-darkthrone}@localhost:${PG_PORT}/${PG_DB:-}${RESET}"
  echo
fi
