# Worktree Manager Notes

- This app is a local-only operator dashboard for DarkThrone worktrees. Keep it coupled to `tools/dev.d/manager-server.mjs`, and update both sides together if the `/worktrees` payload changes.
- Prefer lightweight dependencies here. The app should stay easy to boot alongside the main game apps.
- Use the same domain and service naming as the worktree tooling: `web`, `api`, `website`, and `postgres`.
- Keep the Vitest coverage in this app updated when `/worktrees` payload fields or fetch states change so `./tools/dev up` catches contract drift.
