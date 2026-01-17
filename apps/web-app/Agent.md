# Web App Agent Guide

## Purpose

Primary game client built with React + Vite, using shared client library and interfaces for all API access.

## Architecture

- Entry: `apps/web-app/src/main.tsx`
- App shell: `apps/web-app/src/app.tsx`
- Layouts: `apps/web-app/src/*Layout.tsx`
- Pages: `apps/web-app/src/pages/**`
- Components: `apps/web-app/src/components/**`
- Environment: `apps/web-app/src/environments/*`

## Data & Contracts

- API access must go through `@darkthrone/client-library`.
- Types come from `@darkthrone/interfaces` and `@darkthrone/game-data`.
- Shared static content comes from `@darkthrone/shared-data`.

## Local Commands

- Serve: `npx nx serve web-app`
- Build: `npx nx build web-app`
- Test: `npx nx test web-app`
- Lint: `npx nx lint web-app`

## AI Development Rules

- Never call axios/fetch directly; always use `DarkThroneClient`.
- Keep UI state and API calls local to pages or layout-level logic.
- Prefer shared components in `libs/react-components` when reuse is needed.
- Avoid large visual refactors unless explicitly requested.
- Keep hooks and side effects predictable; avoid hidden global state.
