# DarkThrone Reborn Agent Guide

## Purpose

Maintain fast, consistent AI-assisted development across this Nx monorepo while preserving strict boundaries between apps and shared libraries.

## Architecture Overview

- Apps live in `apps/` and must only talk to each other via shared libs.
- API contracts and shared types live in `libs/interfaces` and are the single source of truth.
- Frontend apps talk to the API through `libs/client-library`, never by direct fetch/axios usage.
- Shared, static content lives in `libs/shared-data`.
- Game balance constants live in `libs/game-data`.
- Shared UI utilities/components live in `libs/react-components`, `libs/shadcnui`, and `libs/shadcnutils`.

## Repo Map

- `apps/api`: Express + Knex backend
- `apps/web-app`: Main game frontend (React + Vite)
- `apps/website`: Marketing/placeholder site (React + Vite)
- `libs/interfaces`: API contract types and shared domain models
- `libs/client-library`: Axios-based API client used by frontends
- `libs/game-data`: Game balance constants
- `libs/shared-data`: Static content (news, copy)
- `libs/react-components`: Shared UI components
- `libs/shadcnui`: Generated shadcn UI components
- `libs/shadcnutils`: shadcn utilities and Tailwind config

## Key Workflows

- Install: `npm install`
- Serve apps: `npx nx run-many -t serve -p api,web-app,website`
- Lint: `npx nx lint <project>`
- Tests: `npx nx test <project>`
- API migrations: `npx nx knex api migrate:latest`

## Contract-First Rule

When adding or changing API behavior:

1. Update `libs/interfaces` endpoint types.
2. Implement API changes in `apps/api` controllers/models/daos.
3. Update `libs/client-library` DAOs to match contracts.
4. Update frontend usage in `apps/web-app` or `apps/website`.

## AI Development Rules

- Never call the API directly from frontend apps; always use `@darkthrone/client-library`.
- Never define request/response shapes outside `@darkthrone/interfaces`.
- Prefer changing shared libs over duplicating logic inside apps.
- Keep types serializable across network boundaries (no functions or class instances).
- Follow existing folder boundaries (controllers, models, daos in API; pages/components in web-app).
- Keep changes minimal and localized; avoid refactors unless explicitly requested.
- Preserve ESLint and Prettier rules; run lint/tests only when requested.
