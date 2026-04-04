# Replit Cleanup Report (2026-04-04)

## Removed

- Root Replit files:
  - `.replit`
  - `.replitignore`
  - `replit.md`
- Artifact metadata folders:
  - `artifacts/api-server/.replit-artifact/`
  - `artifacts/mockup-sandbox/.replit-artifact/`
  - `artifacts/wedding/.replit-artifact/`
- Replit plugin dependencies/usages:
  - Removed `@replit/*` plugin dependencies from artifact package manifests.
  - Removed Replit-only plugin imports/conditional loading from Vite configs.

## Adjusted for portability

- Vite configs now provide safe defaults:
  - wedding defaults to `PORT=5001`, `BASE_PATH=/` when missing.
  - mockup-sandbox defaults to `PORT=5173`, `BASE_PATH=/`.
- API server now defaults to `PORT=8080` if not defined.
- Updated `scripts/post-merge.sh` to use `corepack pnpm` and correct filter (`@workspace/db`).
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
