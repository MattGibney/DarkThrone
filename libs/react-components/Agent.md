# React Components Agent Guide

## Purpose

Shared React components for reuse across frontend apps.

## Architecture

- Entry: `libs/react-components/src/index.ts`
- Components: `libs/react-components/src/**`

## Local Commands

- Test: `npx nx test react-components`
- Lint: `npx nx lint react-components`

## AI Development Rules

- Keep components presentation-focused and reusable.
- Avoid direct API calls; components should accept data via props.
- Follow existing styling patterns and dependencies.
