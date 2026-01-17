# Website Agent Guide

## Purpose

Placeholder marketing site built with React + Vite. Lightweight, mostly static content.

## Architecture

- Entry: `apps/website/src/main.tsx`
- App shell: `apps/website/src/app/app.tsx`
- Pages: `apps/website/src/app/page/**`
- Layout components: `apps/website/src/components/layout/**`
- Environment: `apps/website/src/environments/*`

## Data & Contracts

- Use `@darkthrone/interfaces` for shared types.
- Use `@darkthrone/shared-data` for static content when available.

## Local Commands

- Serve: `npx nx serve website`
- Build: `npx nx build website`
- Lint: `npx nx lint website`

## AI Development Rules

- Keep changes minimal and content-focused.
- Do not introduce new API calls; this app should remain mostly static.
- Follow existing layout structure and styling.
