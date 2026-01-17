# Client Library Agent Guide

## Purpose

Typed Axios client for API access. Used by frontends to talk to the API.

## Architecture

- Entry: `libs/client-library/src/index.ts`
- DAOs: `libs/client-library/src/daos/*`

## Contracts

- All request/response types come from `@darkthrone/interfaces`.
- DAO methods should mirror API endpoints and return typed responses.

## Local Commands

- Test: `npx nx test client-library`
- Lint: `npx nx lint client-library`

## AI Development Rules

- Do not add endpoints without matching interface updates.
- Keep error handling consistent with existing DAOs.
- Avoid adding UI or browser-specific logic beyond client setup.
