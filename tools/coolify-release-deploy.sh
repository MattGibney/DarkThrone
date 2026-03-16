#!/usr/bin/env bash

set -euo pipefail

require_var() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required environment variable: ${name}" >&2
    exit 1
  fi
}

require_command() {
  local name="$1"
  if ! command -v "$name" >/dev/null 2>&1; then
    echo "Missing required command: ${name}" >&2
    exit 1
  fi
}

split_csv() {
  local raw="$1"
  printf '%s' "$raw" | tr ',\n' '\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | sed '/^$/d'
}

api() {
  curl \
    --silent \
    --show-error \
    --fail \
    --retry 3 \
    --retry-all-errors \
    -H "Authorization: Bearer ${COOLIFY_TOKEN}" \
    -H "Content-Type: application/json" \
    "$@"
}

wait_for_deployment() {
  local app_name="$1"
  local deployment_uuid="$2"
  local deadline="$((SECONDS + COOLIFY_DEPLOY_TIMEOUT_SECONDS))"

  while (( SECONDS < deadline )); do
    local deployment_json
    local status

    deployment_json="$(api "${API_BASE}/deployments/${deployment_uuid}")"
    status="$(jq -r '.status // "unknown"' <<<"${deployment_json}" | tr '[:upper:]' '[:lower:]')"

    case "${status}" in
      queued|pending|processing|in_progress|running|starting)
        echo "Deployment ${deployment_uuid} for ${app_name} is ${status}."
        sleep "${COOLIFY_POLL_INTERVAL_SECONDS}"
        ;;
      finished|success|completed)
        echo "Deployment ${deployment_uuid} for ${app_name} succeeded."
        return 0
        ;;
      failed|error|cancelled|canceled)
        echo "Deployment ${deployment_uuid} for ${app_name} failed with status ${status}." >&2
        jq -r '.logs // ""' <<<"${deployment_json}" | tail -n 80 >&2
        return 1
        ;;
      *)
        echo "Deployment ${deployment_uuid} for ${app_name} returned unexpected status ${status}; continuing to poll."
        sleep "${COOLIFY_POLL_INTERVAL_SECONDS}"
        ;;
    esac
  done

  echo "Timed out waiting for deployment ${deployment_uuid}." >&2
  return 1
}

require_command curl
require_command jq
require_var COOLIFY_URL
require_var COOLIFY_TOKEN
require_var COOLIFY_APPLICATION_UUIDS
require_var RELEASE_TAG

COOLIFY_FORCE_REBUILD="${COOLIFY_FORCE_REBUILD:-false}"
COOLIFY_WAIT_FOR_DEPLOYMENTS="${COOLIFY_WAIT_FOR_DEPLOYMENTS:-true}"
COOLIFY_VERSION_ENV_KEYS="${COOLIFY_VERSION_ENV_KEYS:-RELEASE_TAG,COOLIFY_BRANCH}"
COOLIFY_DEPLOY_TIMEOUT_SECONDS="${COOLIFY_DEPLOY_TIMEOUT_SECONDS:-1800}"
COOLIFY_POLL_INTERVAL_SECONDS="${COOLIFY_POLL_INTERVAL_SECONDS:-10}"

coolify_url="${COOLIFY_URL%/}"
if [[ "${coolify_url}" == */api/v1 ]]; then
  API_BASE="${coolify_url}"
else
  API_BASE="${coolify_url}/api/v1"
fi

mapfile -t APP_UUIDS < <(split_csv "${COOLIFY_APPLICATION_UUIDS}")
mapfile -t VERSION_ENV_KEYS < <(split_csv "${COOLIFY_VERSION_ENV_KEYS}")

if (( ${#APP_UUIDS[@]} == 0 )); then
  echo "COOLIFY_APPLICATION_UUIDS did not contain any application UUIDs." >&2
  exit 1
fi

if (( ${#VERSION_ENV_KEYS[@]} == 0 )); then
  echo "COOLIFY_VERSION_ENV_KEYS did not contain any environment variable keys." >&2
  exit 1
fi

echo "Deploying release ${RELEASE_TAG} to ${#APP_UUIDS[@]} Coolify applications."
if [[ -n "${DEPLOYMENT_TARGET_URL:-}" ]]; then
  echo "Primary deployment URL: ${DEPLOYMENT_TARGET_URL}"
fi

for app_uuid in "${APP_UUIDS[@]}"; do
  app_json="$(api "${API_BASE}/applications/${app_uuid}")"
  app_name="$(jq -r '.name // .uuid' <<<"${app_json}")"

  echo "::group::${app_name} (${app_uuid})"

  envs_json="$(api "${API_BASE}/applications/${app_uuid}/envs")"

  for env_key in "${VERSION_ENV_KEYS[@]}"; do
    existing_env_json="$(jq -c --arg key "${env_key}" 'map(select(.key == $key)) | first | if . == null then empty else {key, is_preview: (.is_preview // false), is_literal: (.is_literal // false), is_multiline: (.is_multiline // false), is_shown_once: (.is_shown_once // false)} end' <<<"${envs_json}")"

    if [[ -n "${existing_env_json}" ]]; then
      payload="$(jq -nc --arg value "${RELEASE_TAG}" --argjson env "${existing_env_json}" '$env + {value: $value}')"
      api -X PATCH --data "${payload}" "${API_BASE}/applications/${app_uuid}/envs" >/dev/null
      echo "Updated ${env_key}=${RELEASE_TAG}"
    else
      payload="$(jq -nc --arg key "${env_key}" --arg value "${RELEASE_TAG}" '{key: $key, value: $value, is_preview: false, is_literal: false, is_multiline: false, is_shown_once: false}')"
      api -X POST --data "${payload}" "${API_BASE}/applications/${app_uuid}/envs" >/dev/null
      echo "Created ${env_key}=${RELEASE_TAG}"
    fi
  done

  deployment_json="$(api -X POST "${API_BASE}/applications/${app_uuid}/start?force=${COOLIFY_FORCE_REBUILD}")"
  deployment_uuid="$(jq -r '.deployment_uuid // empty' <<<"${deployment_json}")"

  if [[ -z "${deployment_uuid}" ]]; then
    echo "Coolify did not return a deployment UUID for ${app_name}." >&2
    exit 1
  fi

  echo "Queued deployment ${deployment_uuid}"

  if [[ "${COOLIFY_WAIT_FOR_DEPLOYMENTS}" == "true" ]]; then
    wait_for_deployment "${app_name}" "${deployment_uuid}"
  fi

  echo "::endgroup::"
done
