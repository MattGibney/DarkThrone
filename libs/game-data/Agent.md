# Game Data Agent Guide

## Purpose

Static game balance data, constants, and derived values used across apps.

## Architecture

- Entry: `libs/game-data/src/index.ts`

## Local Commands

- Lint: `npx nx lint game-data`

## AI Development Rules

- Treat values as authoritative gameplay rules.
- Avoid introducing app-specific logic here.
- Keep exports stable to prevent breaking downstream apps.
