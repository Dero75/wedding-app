# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### `artifacts/wedding` — Deborah & Davide Wedding (preview: `/`)
Mobile-first digital wedding invitation and RSVP web app.
- **Stack**: React 18, Vite, TypeScript, Tailwind CSS v4, Wouter, react-hook-form, zod
- **Fonts**: Cormorant Garamond (serif), Jost (sans)
- **Persistence**: localStorage only (Supabase-ready architecture)
- **Pages**: Intro, Home, RSVP, Details, Gift, EntrancePass, Admin
- **Docs**: `artifacts/wedding/DNA/` — 6 markdown files documenting architecture, pages, components, RSVP, Supabase plan, style system
- **Design**: Boho/rustic-chic, warm ivory/dusty rose palette

### `artifacts/api-server` — API Server (preview: `/api`)
Shared Express 5 backend for all artifacts.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/wedding run dev` — run wedding app locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
