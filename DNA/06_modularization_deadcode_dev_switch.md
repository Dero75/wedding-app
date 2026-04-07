# Step Report: Modularization, Dead Code, Dev Switch (2026-04-04)

## Modularization completed

- `artifacts/wedding-app/src/pages/Admin.tsx` reduced to orchestration only.
- Extracted admin modules:
  - `src/pages/admin/constants.ts`
  - `src/pages/admin/components/AdminTextField.tsx`
  - `src/pages/admin/components/AdminStats.tsx`
  - `src/pages/admin/components/AdminContentSection.tsx`
  - `src/pages/admin/components/AdminRsvpSection.tsx`
- `artifacts/wedding-app/src/pages/RSVP.tsx` reduced to orchestration only.
- Extracted RSVP modules:
  - `src/pages/rsvp/schema.ts`
  - `src/pages/rsvp/components/RsvpInputField.tsx`
  - `src/pages/rsvp/components/RsvpConfirmationView.tsx`
  - `src/pages/rsvp/components/RsvpForm.tsx`

Behavior and UI were preserved (same routes, same form flow, same persistence logic and data-testid hooks).

## Dead code / dependency cleanup (safe)

- Removed unused file:
  - `artifacts/wedding-app/src/lib/hooks.ts`
- Removed unused dependency in wedding package:
  - `react-icons`
- Removed unused dependencies in `lib/db` package:
  - `drizzle-zod`
  - `zod`

## Temporary local dev switch

- Added `artifacts/wedding-app/src/components/dev/DevRoleSwitch.tsx`.
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

## Aggiornamento Operativo Finale (2026-04-04)

- Verifiche complete rieseguite: install/ typecheck/ lint/ build/ test tutti OK.
- Rimozione completa logica `vegano` dal runtime RSVP (config, schema, form, storage, test).
- Etichette alimentari aggiornate: `Vegetariani`, `Celiaci`.
- Home ottimizzata: data fissa `Venerdi 11 Settembre 2026`, nome coppia e città centrati con interspazi ridotti; separatore senza icona cuore.
- Dettagli (`Cerimonia`/`Ricevimento`) compattati ~20% mantenendo stile/layout canonico.
- Header admin consolidato: `Home` a sinistra, switch USER/ADMIN centrato, hamburger assente in `/admin*`.
- Stabilità dev server migliorata: avvio detached affidabile in `scripts/wedding-app-dev-server.sh` per evitare stop intermittenti su `5001`.
- Nessuna modifica di business logic; solo consolidamento tecnico e coerenza runtime/documentazione.
