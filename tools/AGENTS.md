# Tools Notes

- Worktree development flows live under `tools/dev` and `tools/dev.d/*`. Prefer extending those scripts instead of adding one-off local bootstrap commands elsewhere.
- Default local domain base is `darkthrone.test`, with the game UI on `<work-id>.darkthrone.test`, the API on `api.<work-id>.darkthrone.test`, and the marketing site on `site.<work-id>.darkthrone.test`.
- On machines that host several local projects, prefer a shared `.test` dnsmasq/resolver setup over a project-specific `darkthrone.test` resolver. DarkThrone still works under `*.darkthrone.test`, but the shared resolver avoids per-project DNS drift.
- On macOS, `dnsmasq` needs to run as a root `brew services` daemon to bind DNS port `53`. A user-level LaunchAgent will often show up as `loaded` but `running: false`/`error`, and `*.darkthrone.test` will keep failing to resolve.
- `./tools/dev env <work-id>` generates `.env.dev` plus app `.env.local` files. Generated app env files back up any pre-existing local files to `*.worktree-backup` and `./tools/dev down` restores them.
- Worktree Docker Compose project names use the `dt-<work-id>` prefix. Keep cleanup and status tooling aligned with that naming scheme.
- `tools/dev.d/manager-server.mjs` is the data source for `apps/worktree-manager`; when its `/worktrees` contract changes, keep the dashboard tests aligned.
- `collect_env_files()` must not emit both the root `.env.dev` and the mirrored `.data/<work-id>/.env.dev` for the same environment, or generated Caddy routes will duplicate and fail validation.
- `./tools/dev caddy` should still run local DNS diagnostics after a successful reload. Otherwise missing `/etc/resolver` or `dnsmasq` config looks like a healthy routing setup even though `*.darkthrone.test` will not resolve.
- `tools/dev` shell helpers run under `set -u`; guard empty-array expansions with a length check before passing `"${array[@]}"` to helper functions.
- `tools/dev.d/LOCAL_DOMAINS.md` should keep the macOS setup idempotent and explicitly cover `dnsmasq` restarts, DNS cache flushes, and verification commands for `Could not resolve host` failures.
- Coolify deployments are managed outside the repo as branch-based apps. `develop` maps to staging and `main` maps to production; do not add repo-local tag/release deployment helpers unless that model changes.
