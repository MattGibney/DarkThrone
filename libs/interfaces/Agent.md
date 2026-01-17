# Interfaces Agent Guide

## Purpose

Single source of truth for API contracts and shared domain types.

## Architecture

- Base types and utilities: `libs/interfaces/src/index.ts`
- Endpoint definitions: `libs/interfaces/src/api/*`

## Usage

- API controllers and client-library DAOs must use these types.
- Changes here ripple through API and frontends; keep updates deliberate.

## Local Commands

- Lint: `npx nx lint interfaces`

## AI Development Rules

- Keep types serializable and portable across network boundaries.
- Avoid importing app-specific code into this library.
- When adding endpoints, include request body, params, and response types.
