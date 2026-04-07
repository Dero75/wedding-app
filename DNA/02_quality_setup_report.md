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
    - `artifacts/wedding-app/src/App.test.tsx`
    - `artifacts/wedding-app/src/test/setup.ts`
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

## Aggiornamento Operativo Finale (2026-04-04)

- Verifiche complete rieseguite: install/ typecheck/ lint/ build/ test tutti OK.
- Rimozione completa logica `vegano` dal runtime RSVP (config, schema, form, storage, test).
- Etichette alimentari aggiornate: `Vegetariani`, `Celiaci`.
- Home ottimizzata: data fissa `Venerdi 11 Settembre 2026`, nome coppia e città centrati con interspazi ridotti; separatore senza icona cuore.
- Dettagli (`Cerimonia`/`Ricevimento`) compattati ~20% mantenendo stile/layout canonico.
- Header admin consolidato: `Home` a sinistra, switch USER/ADMIN centrato, hamburger assente in `/admin*`.
- Stabilità dev server migliorata: avvio detached affidabile in `scripts/wedding-app-dev-server.sh` per evitare stop intermittenti su `5001`.
- Nessuna modifica di business logic; solo consolidamento tecnico e coerenza runtime/documentazione.

## Aggiornamento Enterprise Finale (2026-04-07)

- Eseguito hardening completo runtime con qualità verde (`typecheck`, `lint`, `test`, `build`, `deadcode`).
- Confermata assenza di file funzionali oltre soglia 350 righe.
- Deploy Cloudflare Pages validato (build monorepo `@wedding-app/wedding-app`, output `artifacts/wedding-app/dist/public`).
- Variabili Supabase aggiornate ai nuovi valori progetto (`hbmccalscnescpvomrjo`).
- Intro aggiornata: rimossi i testi "il matrimonio di" e "tocca per entrare"; durata auto a 4.5s.
- Header home aggiornato: pulsante/label `Home` non mostrato su route `/home`.
- Switch `USER/ADMIN` reso visibile anche in deploy (non solo DEV) su `/home` e `/admin*`.
- Home aggiornata senza cambiare business logic: pulsanti CTA ridotti al 70% larghezza; blocco testi principale aumentato del 25%; data/città uniformate a 10px.
- Tipografia UI uniforme: tracking caratteri standardizzato a `tracking-wider` dove applicabile.
- Testi da Admin ora rispettano i ritorni a capo in rendering (`whitespace-pre-line`) mantenendo allineamenti correnti.
- Pagina Programma estesa con sezione contributo + modale IBAN (copia/intestatario) mantenendo coerenza visiva.
- Nessuna modifica alle logiche di business (RSVP confirm-only, pass gating, flussi admin).
