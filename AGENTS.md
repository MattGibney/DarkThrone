# Workspace Notes

- Package management: keep `vite` on major 7 while the workspace is on `@nx/vite@22.5.4` / `@nx/vitest@22.5.4`. Those Nx packages currently peer-depend on `vite` `^5 || ^6 || ^7`, so bumping to `vite@8` or `@vitejs/plugin-react@6` will break `npm install`.
- Package management: keep `eslint` on major 9 with the current lint plugin set. `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`, and `eslint-plugin-react-hooks` in this repo do not yet accept `eslint@10`, so a clean `npm install` will fail with `ERESOLVE` if it is bumped.
- Dependency changes: when upgrading the toolchain, align `vite`, `@vitejs/plugin-react`, and `vitest` with the Nx peer ranges before regenerating `package-lock.json`.
- Local dev environments: prefer `./tools/dev up [work-id]` over the legacy `apps/api/docker-compose.yml` flow when you need isolated worktree ports and data. This generates `.env.dev` plus app-specific `.env.local` files and routes local domains via Caddy.
- Worktree routing: the default domain base is `darkthrone.test`, with the game UI on `<work-id>.darkthrone.test`, the API on `api.<work-id>.darkthrone.test`, and the marketing site on `site.<work-id>.darkthrone.test`.
- Operator tooling: `npx nx run worktree-manager:serve` starts the local worktree dashboard backed by `tools/dev.d/manager-server.mjs`. Keep the dashboard payload and the manager server in sync.
- Deployments: Coolify deploys are branch-based. `develop` is staging and `main` is production. Do not treat tag or GitHub release procedures as a source of truth unless the deployment model changes again.
- Shared code scope: do not create a new Nx library for tiny cross-app helpers. Keep trivial environment-resolution logic local unless the shared surface is substantial enough to justify package overhead.
