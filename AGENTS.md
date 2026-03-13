# Workspace Notes

- Package management: keep `vite` on major 7 while the workspace is on `@nx/vite@22.5.4` / `@nx/vitest@22.5.4`. Those Nx packages currently peer-depend on `vite` `^5 || ^6 || ^7`, so bumping to `vite@8` or `@vitejs/plugin-react@6` will break `npm install`.
- Package management: keep `eslint` on major 9 with the current lint plugin set. `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`, and `eslint-plugin-react-hooks` in this repo do not yet accept `eslint@10`, so a clean `npm install` will fail with `ERESOLVE` if it is bumped.
- Dependency changes: when upgrading the toolchain, align `vite`, `@vitejs/plugin-react`, and `vitest` with the Nx peer ranges before regenerating `package-lock.json`.
