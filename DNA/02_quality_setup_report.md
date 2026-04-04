# Quality Setup Report (2026-04-04)

## Installed/configured

- TypeScript strict mode baseline:
  - Updated `tsconfig.base.json` with `strict: true`, `noImplicitOverride: true`.
- ESLint:
  - Added root `eslint.config.mjs` (flat config) with TS + import + unused imports controls.
  - Enforced `unused-imports/no-unused-imports` and no warnings policy (`--max-warnings=0`).
- Prettier:
  - Added `.prettierrc.json` and `.prettierignore`.
- Test runner/frontend test env:
  - Added `vitest`, `jsdom`, Testing Library, `@vitest/coverage-v8`.
  - Added `vitest.config.ts` with alias support and coverage config.
  - Added minimal frontend test:
    - `artifacts/wedding/src/App.test.tsx`
    - `artifacts/wedding/src/test/setup.ts`
- Dead code analysis:
  - Added `knip` script (`deadcode`) with non-blocking execution.

## Root script standardization

- Added/updated scripts in root `package.json`:
  - `typecheck`, `lint`, `build`, `test`, `test:coverage`, `deadcode`, `format`, `format:check`.
- Added `packageManager: pnpm@10.33.0`.
- Root scripts now use `corepack pnpm` to avoid dependency on globally installed pnpm.

## Dependency/config corrections

- Removed Replit-only packages from frontend artifacts (`@replit/*`).
- Pruned Replit Linux-only overrides from `pnpm-workspace.yaml` causing local build failures.
- Added root `@vitejs/plugin-react` because it is used by `vitest.config.ts`.
- Removed unused `eslint-plugin-react-refresh` dependency from root.
- Reduced wedding package dependency footprint by removing unused UI/scaffold dependencies after usage verification.
- Removed obsolete wedding UI scaffold files not referenced by runtime (keeping only toast/toaster/tooltip components).

## Aggiornamento Allineamento Finale (2026-04-04)

- Verificata coerenza runtime/documentazione con stato codice corrente.
- Admin: in area `/admin*` hamburger nascosto; su `/admin` resta shortcut impostazioni.
- Admin home: KPI unico `Confermati`.
- Admin settings: editor contenuti in box bianchi separati per sezione frontend.
- RSVP: header ridotto al solo titolo; select `Minorenni` con label `minorenne/minorenni`.
- Tipografia canonica confermata: titoli serif, UI/testi sans.
- Nessuna nuova logica business introdotta in questo allineamento documentale.
