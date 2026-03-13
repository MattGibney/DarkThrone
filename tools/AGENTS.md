# Tools Notes

- Worktree development flows live under `tools/dev` and `tools/dev.d/*`. Prefer extending those scripts instead of adding one-off local bootstrap commands elsewhere.
- Default local domain base is `darkthrone.test`, with the game UI on `<work-id>.darkthrone.test`, the API on `api.<work-id>.darkthrone.test`, and the marketing site on `site.<work-id>.darkthrone.test`.
- `./tools/dev env <work-id>` generates `.env.dev` plus app `.env.local` files. Generated app env files back up any pre-existing local files to `*.worktree-backup` and `./tools/dev down` restores them.
- Worktree Docker Compose project names use the `dt-<work-id>` prefix. Keep cleanup and status tooling aligned with that naming scheme.
- `tools/dev.d/manager-server.mjs` is the data source for `apps/worktree-manager`; when its `/worktrees` contract changes, keep the dashboard tests aligned.
- `collect_env_files()` must not emit both the root `.env.dev` and the mirrored `.data/<work-id>/.env.dev` for the same environment, or generated Caddy routes will duplicate and fail validation.
- `tools/dev.d/LOCAL_DOMAINS.md` should keep the macOS setup idempotent and explicitly cover `dnsmasq` restarts, DNS cache flushes, and verification commands for `Could not resolve host` failures.
- `tools/deploy-script.ts` is deprecated. Use `tools/coolify-release-deploy.sh` for GitHub release-driven Coolify deployments, and keep it aligned with `.github/workflows/coolify-release-deploy.yml`.
