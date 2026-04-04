# Step Report: Modularization, Dead Code, Dev Switch (2026-04-04)

## Modularization completed

- `artifacts/wedding/src/pages/Admin.tsx` reduced to orchestration only.
- Extracted admin modules:
  - `src/pages/admin/constants.ts`
  - `src/pages/admin/components/AdminTextField.tsx`
  - `src/pages/admin/components/AdminStats.tsx`
  - `src/pages/admin/components/AdminContentSection.tsx`
  - `src/pages/admin/components/AdminRsvpSection.tsx`
- `artifacts/wedding/src/pages/RSVP.tsx` reduced to orchestration only.
- Extracted RSVP modules:
  - `src/pages/rsvp/schema.ts`
  - `src/pages/rsvp/components/RsvpInputField.tsx`
  - `src/pages/rsvp/components/RsvpConfirmationView.tsx`
  - `src/pages/rsvp/components/RsvpForm.tsx`

Behavior and UI were preserved (same routes, same form flow, same persistence logic and data-testid hooks).

## Dead code / dependency cleanup (safe)

- Removed unused file:
  - `artifacts/wedding/src/lib/hooks.ts`
- Removed unused dependency in wedding package:
  - `react-icons`
- Removed unused dependencies in `lib/db` package:
  - `drizzle-zod`
  - `zod`

## Temporary local dev switch

- Added `artifacts/wedding/src/components/dev/DevRoleSwitch.tsx`.
- Integrated in `Layout` replacing the header-left home label when running locally in development:
  - visible only with `import.meta.env.DEV`
  - active in `/home` and `/admin`
  - touch-friendly `USER` / `ADMIN` toggle
  - `USER` routes to `/home`, `ADMIN` routes to `/admin`
- In production build the switch is hidden and the standard home link remains.

## Validation run

- `corepack pnpm install` ✅
- `corepack pnpm run typecheck` ✅
- `corepack pnpm run lint` ✅
- `corepack pnpm run build` ✅
- `corepack pnpm run test` ✅
- `corepack pnpm run deadcode` ✅ (non-blocking; still reports large scaffold areas)

## Residual technical note

- `knip` is now configured (`knip.json`) to focus on runtime-relevant scope; remaining signal is export-level and non-blocking.

## Subsequent updates (same day)

- RSVP deadline text removed from runtime copy:
  - `/rsvp` now states: "Le adesioni sono sempre aperte."
- Removed dead admin toggle logic (`showCountdown`) because no countdown UI is active.
- Removed `Visibilità sezioni` from AdminSettings and deleted all visibility toggle runtime logic.
- Removed `Stile dell'app` preset selector and all multi-theme runtime logic; only canonical avorio theme remains.
- Wedding UI scaffold pruned to canonical runtime set (`toast`, `toaster`, `tooltip`) with no UX or business-logic changes.
- Wedding package dependencies were reduced accordingly; full validation (`install`, `typecheck`, `lint`, `build`, `test`) remains green.
- GitHub flow is now operational on `main` with successful push to `origin`.

## Aggiornamento Allineamento Finale (2026-04-04)

- Verificata coerenza runtime/documentazione con stato codice corrente.
- Admin: in area `/admin*` hamburger nascosto; su `/admin` resta shortcut impostazioni.
- Admin home: KPI unico `Confermati`.
- Admin settings: editor contenuti in box bianchi separati per sezione frontend.
- RSVP: header ridotto al solo titolo; select `Minorenni` con label `minorenne/minorenni`.
- Tipografia canonica confermata: titoli serif, UI/testi sans.
- Nessuna nuova logica business introdotta in questo allineamento documentale.
