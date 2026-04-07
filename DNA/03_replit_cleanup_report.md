# Replit Cleanup Report (2026-04-04)

## Removed

- Root Replit files:
  - `.replit`
  - `.replitignore`
  - `replit.md`
- Artifact metadata folders:
  - `artifacts/api-server/.replit-artifact/`
  - `artifacts/mockup-sandbox/.replit-artifact/`
  - `artifacts/wedding-app/.replit-artifact/`
- Replit plugin dependencies/usages:
  - Removed `@replit/*` plugin dependencies from artifact package manifests.
  - Removed Replit-only plugin imports/conditional loading from Vite configs.

## Adjusted for portability

- Vite configs now provide safe defaults:
  - wedding defaults to `PORT=5001`, `BASE_PATH=/` when missing.
  - mockup-sandbox defaults to `PORT=5173`, `BASE_PATH=/`.
- API server now defaults to `PORT=8080` if not defined.
- Updated `scripts/post-merge.sh` to use `corepack pnpm` and correct filter (`@wedding-app/db`).
- Removed remaining Replit references in source comments.

## Validation

- No active Replit references remain in tracked source/config files (`rg` scan excluding git/lock/dist/node_modules/attached_assets returned empty).

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
