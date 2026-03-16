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

## Deployments

Deployments are branch-based in Coolify:

- `develop` deploys to staging
- `main` deploys to production

The repo no longer uses GitHub release or tag-driven deployment automation. Configure the staging and production applications in Coolify to track their respective branches directly, and let Coolify handle deploy-on-push or manual redeploys from those branches.

Recommended Coolify setup:

- point staging apps at `develop` and production apps at `main`
- keep the database out of the git-backed application deploy flow
- avoid reintroducing tag or release procedures unless the deployment model changes again

## Legacy Minimal Setup

If you only want a quick database without the worktree tooling, the old API-only compose file still exists at [`apps/api/docker-compose.yml`](./apps/api/docker-compose.yml). The worktree tooling is the recommended path for ongoing development.

## Architecture

### API

The API is the main backend for the game. It handles business logic, persistence, and timed game systems.

### Web App

The web app is the main player-facing client. It talks to the API through the shared client library.

### Website

The website is the public-facing placeholder and marketing surface for the game.
