# Diagnostic Report (2026-04-04)

## Repository shape

- Project type: pnpm workspace monorepo.
- Workspace packages:
  - `artifacts/wedding` (main React/Vite web app).
  - `artifacts/api-server` (Express 5 API server).
  - `artifacts/mockup-sandbox` (component preview artifact, not part of wedding runtime).
  - `lib/api-client-react`, `lib/api-zod`, `lib/api-spec`, `lib/db` (shared libs/codegen/db).
  - `scripts` (utility workspace package).

## Active entrypoints

- Frontend app entrypoint: `artifacts/wedding/src/main.tsx` -> `App.tsx`.
- Frontend routes: `/`, `/home`, `/rsvp`, `/details`, `/gift`, `/pass`, `/admin` in `artifacts/wedding/src/App.tsx`.
- API entrypoint: `artifacts/api-server/src/index.ts` -> `app.ts` with `/api/healthz`.
- Build entrypoints:
  - wedding: `vite build --config vite.config.ts` -> `artifacts/wedding/dist/public`.
  - mockup-sandbox: `vite build` -> `artifacts/mockup-sandbox/dist`.
  - api-server: `node build.mjs` (esbuild ESM bundle).

## Runtime/storage state

- Client state and persistence: localStorage/sessionStorage via `artifacts/wedding/src/lib/storage.ts`.
- No Supabase runtime wired.
- API client package exists but is not currently used by wedding app runtime.

## Structural findings

- Monorepo is valid and buildable after cleanup.
- Large modules still present (top examples):
  - `artifacts/wedding/src/components/ui/sidebar.tsx` (695 lines)
  - `artifacts/wedding/src/components/ui/chart.tsx` (331 lines)
  - `lib/api-client-react/src/custom-fetch.ts` (371 lines)
- `Admin.tsx` and `RSVP.tsx` are now modularized (`89` and `78` lines) with extracted submodules in `src/pages/admin/*` and `src/pages/rsvp/*`.
- Dead/scaffold-heavy UI surface still exists (knip mostly flags `components/ui/*` scaffold files).

## Portability findings before fixes

- Root scripts required a global `pnpm` binary (not available in this environment).
- Build failed on macOS because workspace overrides removed non-Linux Rollup/esbuild binaries.
- Vite configs required `PORT` and `BASE_PATH` env vars with hard failure if missing.
