# API Agent Guide

## Purpose

Express + Knex backend responsible for business logic, data persistence, and time-based jobs.

## Architecture

- Entry: `apps/api/src/main.ts`
- Express app: `apps/api/src/app.ts`
- Routes: `apps/api/src/router.ts`
- Controllers: `apps/api/src/controllers/*`
- Models: `apps/api/src/models/*`
- DAOs: `apps/api/src/daos/*`
- Cron jobs: `apps/api/src/cron.ts`, `apps/api/src/scripts/*`
- Config: `apps/api/config/environment.ts`

## Contracts

- Request/response types are defined in `libs/interfaces`.
- Controllers must use the shared contract types for payloads and responses.
- Any new endpoint requires matching updates in `libs/interfaces` and `libs/client-library`.

## Data Access

- Use DAOs for database access and models for domain logic.
- Keep controller logic thin and delegate to models/DAOs.

## Local Commands

- Serve: `npx nx serve api`
- Build: `npx nx build api`
- Test: `npx nx test api`
- Lint: `npx nx lint api`
- Migrations: `npx nx knex api migrate:latest`

## AI Development Rules

- Do not add routes without updating `libs/interfaces`.
- Do not return untyped payloads; use shared interface types.
- Keep request context usage consistent (`req.ctx`).
- Avoid changing auth/session behavior unless explicitly requested.
- Prefer additive changes over re-architecting models/DAOs.
