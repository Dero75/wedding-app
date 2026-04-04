# Enterprise Hardening Report (2026-04-04)

## Scope

Consolidation pass after multiple change rounds, with strict constraints:

- no business logic changes
- no UX/layout redesign
- cleanup, stability, and maintainability only

## Changes applied

- Removed RSVP deadline copy from runtime UI:
  - `artifacts/wedding/src/pages/RSVP.tsx`
  - Current copy: "Le adesioni sono sempre aperte."
- Removed local demo RSVP auto-seeding from runtime and added one-shot local record reset in DEV.
- Added operational app lifecycle scripts:
  - `scripts/wedding-dev-server.sh`
  - root commands: `app:start`, `app:stop`, `app:restart`, `app:status`
- Removed dead admin visibility setting that had no active consumer:
  - `showCountdown` removed from `AdminSettings` in `src/lib/storage.ts`
  - corresponding toggle removed from `src/pages/admin/constants.ts`
- Removed obsolete wedding UI scaffold files not referenced by runtime:
  - reduced `src/components/ui/` to canonical runtime set: `toast.tsx`, `toaster.tsx`, `tooltip.tsx`
  - removed orphan hook `src/hooks/use-mobile.tsx`
- Reduced wedding package dependencies to the set actually used by runtime.
- Reduced `lib/api-client-react/src/custom-fetch.ts` to 329 lines (from 362) with comment-only reduction and no behavioral changes.

## Stability and quality validation

Executed after cleanup:

- `corepack pnpm install`
- `corepack pnpm run typecheck`
- `corepack pnpm run lint`
- `corepack pnpm run build`
- `corepack pnpm run test`
- `corepack pnpm run deadcode`

All required gates are green.

## Measurable outcomes

- Wedding `src/components/ui/` reduced from large scaffold set to 3 runtime files.
- Added `knip.json` and reduced runtime dead-code signal to a short list of export-level leftovers.
- Non-runtime playground (`artifacts/mockup-sandbox`) excluded from dead-code governance noise.
- Wedding CSS bundle reduced from earlier 107.58 kB phase baseline to ~44.74 kB gzip-ready output in current build.
- New backup generated with canonical naming and non-overwrite policy:
  - `backup/Backup_4 Aprile_15.23.tar.zst`

## Remaining non-blocking risks

- Some exports are still unused in runtime/shared utility modules (`toast`, `tooltip`, `use-toast`, `lib/api-client-react`).
- `lib/api-client-react/src/custom-fetch.ts` is now under threshold but remains a complex core utility; keep covered by regression tests if expanded.

## Aggiornamento Allineamento Finale (2026-04-04)

- Verificata coerenza runtime/documentazione con stato codice corrente.
- Admin: in area `/admin*` hamburger nascosto; su `/admin` resta shortcut impostazioni.
- Admin home: KPI unico `Confermati`.
- Admin settings: editor contenuti in box bianchi separati per sezione frontend.
- RSVP: header ridotto al solo titolo; select `Minorenni` con label `minorenne/minorenni`.
- Tipografia canonica confermata: titoli serif, UI/testi sans.
- Nessuna nuova logica business introdotta in questo allineamento documentale.
