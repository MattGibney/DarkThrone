# Shared Data Agent Guide

## Purpose

Static content shared between apps (news posts, copy, fixtures).

## Architecture

- Entry: `libs/shared-data/src/index.ts`

## Local Commands

- Lint: `npx nx lint shared-data`

## AI Development Rules

- Keep data format compatible with `@darkthrone/interfaces` types.
- Avoid app-specific rendering or logic in this library.
