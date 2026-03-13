# Tools Notes

- Worktree development flows live under `tools/dev` and `tools/dev.d/*`. Prefer extending those scripts instead of adding one-off local bootstrap commands elsewhere.
- Default local domain base is `darkthrone.test`, with the game UI on `<work-id>.darkthrone.test`, the API on `api.<work-id>.darkthrone.test`, and the marketing site on `site.<work-id>.darkthrone.test`.
- `./tools/dev env <work-id>` generates `.env.dev` plus app `.env.local` files. Generated app env files back up any pre-existing local files to `*.worktree-backup` and `./tools/dev down` restores them.
- Worktree Docker Compose project names use the `dt-<work-id>` prefix. Keep cleanup and status tooling aligned with that naming scheme.
