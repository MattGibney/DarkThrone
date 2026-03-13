# DarkThrone Reborn

DarkThrone Reborn is an Nx-managed TypeScript monorepo containing the DarkThrone API, the main game client, and the public-facing website.

## Requirements

| Requirement | Version                     |
| ----------- | --------------------------- |
| Node        | 22.x                        |
| npm         | 10.x                        |
| Docker      | Current                     |
| Caddy       | Optional, for local domains |

If you prefer `mise`, the repo includes [`./.mise.toml`](./.mise.toml).

## Recommended Local Workflow

The repo now includes worktree-aware development tooling modeled on the Big-Picture setup.

Bootstrap a local environment:

```bash
./tools/dev up dev
```

That command will:

- generate `.env.dev` plus app-specific `.env.local` files,
- start a per-environment PostgreSQL container with Docker Compose,
- update local Caddy routes if Caddy is installed,
- run `npm install`,
- run API migrations,
- create and migrate the API test database,
- run the Nx test targets.

Then start the main apps:

```bash
NX_TUI=false npx nx run-many -t serve -p api web-app website -- --host=0.0.0.0
```

Useful helper commands:

```bash
./tools/dev info
./tools/dev down
./tools/dev cleanup
npx nx run worktree-manager:serve
```

## Local Domains

By default, worktree environments use `darkthrone.test`:

- Game UI: `http://<work-id>.darkthrone.test:8080`
- API: `http://api.<work-id>.darkthrone.test:8080`
- Website: `http://site.<work-id>.darkthrone.test:8080`

Before relying on those hostnames, complete the host-level `dnsmasq` and resolver setup in [`tools/dev.d/LOCAL_DOMAINS.md`](./tools/dev.d/LOCAL_DOMAINS.md), then restart `dnsmasq` and run `./tools/dev caddy`.

Recommended verification:

```bash
dscacheutil -q host -a name <work-id>.darkthrone.test
curl -I http://<work-id>.darkthrone.test:8080
```

If `curl` reports `Could not resolve host`, follow the DNS troubleshooting steps in [`tools/dev.d/LOCAL_DOMAINS.md`](./tools/dev.d/LOCAL_DOMAINS.md) before assuming the app or Caddy is down.

## Worktree Usage

For parallel workstreams:

1. Create a git worktree.
2. `cd` into that worktree.
3. Run `./tools/dev up`.
4. Start the apps with Nx.

The tooling derives the work ID from the worktree path when possible and allocates isolated ports and data directories under `.data/<work-id>/`.

## Release Deployments

The repo now includes a GitHub Actions workflow for release-driven Coolify deploys at [`./.github/workflows/coolify-release-deploy.yml`](./.github/workflows/coolify-release-deploy.yml).

Deployment routing is based on the GitHub release event:

- publish a prerelease to deploy the tagged version to the `staging` GitHub environment,
- publish a full release, or promote a prerelease to a full release, to deploy the tagged version to the `production` GitHub environment.

The workflow uses the published release tag, updates one or more application environment variables in Coolify, and then triggers a rebuild/redeploy for each configured application UUID. By default it updates `COOLIFY_BRANCH`, which fits the existing tag-based workaround, but you can add extra keys such as `APP_VERSION` through a GitHub environment variable.

Required GitHub environment secrets for both `staging` and `production`:

- `COOLIFY_URL`: base URL for the Coolify instance, for example `https://coolify.example.com`
- `COOLIFY_TOKEN`: Coolify API token
- `COOLIFY_APPLICATION_UUIDS`: comma-separated or newline-separated Coolify application UUIDs for `api`, `web-app`, and `website`

Optional GitHub environment variables for both `staging` and `production`:

- `COOLIFY_VERSION_ENV_KEYS`: comma-separated env keys to set to the release tag. Defaults to `COOLIFY_BRANCH`.
- `COOLIFY_FORCE_REBUILD`: `true` or `false`. Defaults to `false`.
- `COOLIFY_WAIT_FOR_DEPLOYMENTS`: `true` or `false`. Defaults to `true`.
- `COOLIFY_DEPLOY_TIMEOUT_SECONDS`: max wait time when polling deployment status. Defaults to `1800`.
- `COOLIFY_POLL_INTERVAL_SECONDS`: polling interval in seconds. Defaults to `10`.

Recommended Coolify setup:

- keep the database out of `COOLIFY_APPLICATION_UUIDS`; release publishes should redeploy the git-backed apps, not the database,
- disable any conflicting auto-deploy-on-push behavior for these release-managed applications,
- make sure each application can resolve the published git tag you intend to deploy.

## Legacy Minimal Setup

If you only want a quick database without the worktree tooling, the old API-only compose file still exists at [`apps/api/docker-compose.yml`](./apps/api/docker-compose.yml). The worktree tooling is the recommended path for ongoing development.

## Architecture

### API

The API is the main backend for the game. It handles business logic, persistence, and timed game systems.

### Web App

The web app is the main player-facing client. It talks to the API through the shared client library.

### Website

The website is the public-facing placeholder and marketing surface for the game.
