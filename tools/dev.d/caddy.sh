#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=../dev-lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/../dev-lib.sh"

repo_root="$REPO_ROOT"
data_root="${repo_root}/.data"
caddy_dir="${data_root}/caddy"
caddy_file="${caddy_dir}/Caddyfile"

if [[ -f "${repo_root}/.env.local" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${repo_root}/.env.local"
  set +a
fi

upstream_host="${CADDY_UPSTREAM_HOST:-127.0.0.1}"
domain_base="${LOCAL_DOMAIN_BASE:-darkthrone.test}"
http_port="${CADDY_HTTP_PORT:-8080}"

mkdir -p "$caddy_dir"

{
  echo "{"
  echo "  auto_https off"
  echo "}"
  echo

  env_files=()
  while IFS= read -r env_file; do
    [[ -f "$env_file" ]] && env_files+=("$env_file")
  done < <(collect_env_files "$repo_root")

  if [[ "${#env_files[@]}" -eq 0 ]]; then
    echo "# No environments found."
  else
    for env_file in "${env_files[@]}"; do
      set -a
      # shellcheck disable=SC1090
      source "$env_file"
      set +a

      if [[ -z "${WORK_ID:-}" ]]; then
        continue
      fi

      work_slug="$(slugify_lower "$WORK_ID")"
      if [[ -z "$work_slug" ]]; then
        continue
      fi

      if [[ "$http_port" == "80" ]]; then
        web_addr="http://${work_slug}.${domain_base}"
        api_addr="http://api.${work_slug}.${domain_base}"
        site_addr="http://site.${work_slug}.${domain_base}"
      else
        web_addr="http://${work_slug}.${domain_base}:${http_port}"
        api_addr="http://api.${work_slug}.${domain_base}:${http_port}"
        site_addr="http://site.${work_slug}.${domain_base}:${http_port}"
      fi

      echo "# ${WORK_ID}"

      if [[ -n "${WEB_APP_PORT:-}" ]]; then
        echo "${web_addr} {"
        echo "  reverse_proxy ${upstream_host}:${WEB_APP_PORT}"
        echo "}"
      fi

      if [[ -n "${API_PORT:-}" ]]; then
        echo "${api_addr} {"
        echo "  reverse_proxy ${upstream_host}:${API_PORT}"
        echo "}"
      fi

      if [[ -n "${WEBSITE_PORT:-}" ]]; then
        echo "${site_addr} {"
        echo "  reverse_proxy ${upstream_host}:${WEBSITE_PORT}"
        echo "}"
      fi

      echo
    done
  fi
} > "$caddy_file"

caddy fmt --overwrite "$caddy_file" 2>/dev/null || true

if ! command -v caddy >/dev/null 2>&1; then
  echo "Caddy not found. Install it (brew install caddy) to enable local domains."
  exit 0
fi

if caddy reload --config "$caddy_file" --adapter caddyfile >/dev/null 2>&1; then
  exit 0
fi

caddy stop >/dev/null 2>&1 || true
caddy start --config "$caddy_file" --adapter caddyfile --watch >/dev/null 2>&1

sleep 1
if ! pgrep -x caddy >/dev/null 2>&1; then
  echo "Caddy failed to start in background."
  echo "Try: caddy run --config ${caddy_file} --adapter caddyfile"
  exit 1
fi

check_dns "${WORK_ID:-}"
