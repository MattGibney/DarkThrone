#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=../dev-lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/../dev-lib.sh"

repo_root="$REPO_ROOT"

usage() {
  cat <<EOF
Usage: ${DEV_CMD:-$0} [--force] [--deps-only] [env-id]

Sets up the development environment (deps + docker + env files + migrations + tests).

By default it derives an ID from the current worktree name or .data/ contents.
If [env-id] is provided, it overrides the derived name.

Options:
  --force      Skip the confirmation prompt when re-bootstrapping an existing environment.
  --deps-only  Configure env files + start/update dependency containers only.
EOF
}

force=false
deps_only=false
for arg in "$@"; do
  case "$arg" in
    -h|--help) usage; exit 0 ;;
    --force) force=true ;;
    --deps-only) deps_only=true ;;
  esac
done

env_id=""
for arg in "$@"; do
  case "$arg" in
    -*) ;;
    *) env_id="$arg"; break ;;
  esac
done

if [[ -z "$env_id" ]]; then
  env_id="$(derive_env_id)"
fi

if [[ -z "$env_id" ]]; then
  echo "Unable to determine environment ID automatically."
  echo "Run again with an explicit env ID (for example: ${DEV_CMD:-$0} dev)."
  exit 1
fi

cd "$repo_root"

if [[ "$force" == false && -f "${repo_root}/.env.dev" ]]; then
  existing_id="$(sed -n 's/^WORK_ID=//p' "${repo_root}/.env.dev" 2>/dev/null || true)"
  echo
  echo "This environment has already been bootstrapped${existing_id:+ (env: ${existing_id})}."
  echo "Re-running will overwrite generated env files and re-run migrations."
  echo
  if [[ -t 0 ]]; then
    read -rp "Continue? [y/N] " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
      echo "Aborted."
      exit 0
    fi
  else
    echo "Non-interactive shell detected. Pass --force to skip this check."
    exit 1
  fi
fi

echo "Configuring env files for: ${env_id}"
"${TOOLS_DIR}/dev.d/env.sh" "$env_id"

env_file="${repo_root}/.env.dev"
if [[ ! -f "$env_file" ]]; then
  echo "Expected env file not found: ${env_file}"
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$env_file"
set +a

if [[ -z "${WORK_ID:-}" || -z "${DATA_ROOT:-}" ]]; then
  echo "WORK_ID or DATA_ROOT is missing in ${env_file}"
  exit 1
fi

compose_project="${COMPOSE_PROJECT:-dt-$(slugify_lower "${WORK_ID}")}"

echo "Waiting for Docker..."
wait_for_docker

compose_cmd="$(resolve_compose)"
if [[ -z "$compose_cmd" ]]; then
  echo "Neither 'docker compose' nor 'docker-compose' found. Install Docker Compose."
  exit 1
fi

echo "Starting dependency services via Docker Compose..."
$compose_cmd -f "${repo_root}/docker-compose.dev.yml" -p "$compose_project" up -d

echo "Updating local DNS routes (Caddy)..."
"${TOOLS_DIR}/dev.d/caddy.sh" || true

echo "Waiting for Postgres..."
wait_for_port "127.0.0.1" "${PG_PORT}" "postgres"

if [[ "$deps_only" == true ]]; then
  echo "Dependency services are ready for ${WORK_ID} (deps-only mode)."
  exit 0
fi

echo "Installing npm dependencies..."
npm install

api_env="${repo_root}/apps/api/.env.local"
if [[ -f "$api_env" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$api_env"
  set +a
fi

echo "Running Postgres migrations..."
npx nx knex api migrate:latest

test_env="${repo_root}/apps/api/.env.test.local"
if [[ -f "$test_env" ]]; then
  test_db_name="$(sed -n 's/^RDS_DB_NAME=//p' "$test_env")"
  if [[ -n "$test_db_name" ]]; then
    echo "Creating test database ${test_db_name} (if it does not exist)..."
    $compose_cmd -f "${repo_root}/docker-compose.dev.yml" -p "$compose_project" \
      exec -T postgres psql -U "${PG_USER}" -d "${PG_DB}" -tc \
      "SELECT 1 FROM pg_database WHERE datname = '${test_db_name}'" | grep -q 1 \
      || $compose_cmd -f "${repo_root}/docker-compose.dev.yml" -p "$compose_project" \
        exec -T postgres psql -U "${PG_USER}" -d "${PG_DB}" -c "CREATE DATABASE \"${test_db_name}\""

    echo "Running Postgres migrations on test database..."
    RDS_DB_NAME="${test_db_name}" npx nx knex api migrate:latest
  fi
fi

echo "Running tests..."
JEST_WATCHMAN=0 NX_TUI=false npx nx run-many -t test --all

if ! pgrep -x caddy >/dev/null 2>&1; then
  echo
  echo "WARNING: Caddy is not running. Local domains will not work."
  echo "  Run: ./tools/dev caddy"
else
  check_dns "${WORK_ID}"
fi

echo
echo "Environment setup completed for ${WORK_ID}."
