# Diagnostic Report (2026-04-04)

## Repository shape

- Project type: pnpm workspace monorepo.
- Workspace packages:
  - `artifacts/wedding-app` (main React/Vite web app).
  - `artifacts/api-server` (Express 5 API server).
  - `artifacts/mockup-sandbox` (component preview artifact, not part of wedding runtime).
  - `lib/api-client-react`, `lib/api-zod`, `lib/api-spec`, `lib/db` (shared libs/codegen/db).
  - `scripts` (utility workspace package).

## Active entrypoints

- Frontend app entrypoint: `artifacts/wedding-app/src/main.tsx` -> `App.tsx`.
- Frontend routes: `/`, `/home`, `/rsvp`, `/details`, `/gift`, `/pass`, `/admin` in `artifacts/wedding-app/src/App.tsx`.
- API entrypoint: `artifacts/api-server/src/index.ts` -> `app.ts` with `/api/healthz`.
- Build entrypoints:
  - wedding: `vite build --config vite.config.ts` -> `artifacts/wedding-app/dist/public`.
  - mockup-sandbox: `vite build` -> `artifacts/mockup-sandbox/dist`.
  - api-server: `node build.mjs` (esbuild ESM bundle).

## Runtime/storage state

- Client state and persistence: localStorage/sessionStorage via `artifacts/wedding-app/src/lib/storage.ts`.
- RSVP canonical fields: `firstName`, `lastName`, `guestCount`, `childrenCount`, `dietaryCounts`, `submittedAt`.
- No Supabase runtime wired.
- API client package exists but is not currently used by wedding app runtime.
- Supabase future-sync coordinates are registered in project template:
  - `artifacts/wedding-app/.env.example`
  - `DNA/12_wedding_future_supabase_plan.md`

## Structural findings

- Monorepo is valid and buildable after cleanup.
- Large modules still present (top examples):
  - `lib/api-client-react/src/custom-fetch.ts` (329 lines, reduced under 350 without logic changes)
- `Admin.tsx` and `RSVP.tsx` are now modularized (`89` and `78` lines) with extracted submodules in `src/pages/admin/*` and `src/pages/rsvp/*`.
- Wedding UI surface is now canonical and minimal:
  - `src/components/ui/toast.tsx`
  - `src/components/ui/toaster.tsx`
  - `src/components/ui/tooltip.tsx`
- Dead/scaffold-heavy area now remains mainly in `artifacts/mockup-sandbox` (non-runtime package for wedding app).

## Portability findings before fixes

- Root scripts required a global `pnpm` binary (not available in this environment).
- Build failed on macOS because workspace overrides removed non-Linux Rollup/esbuild binaries.
- Vite configs required `PORT` and `BASE_PATH` env vars with hard failure if missing.
- Added deterministic local app lifecycle script (`scripts/wedding-app-dev-server.sh`) for port `5001` start/stop/restart/status.

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

## Aggiornamento Enterprise (2026-04-08)

- Verificato e consolidato lo stato del runtime dopo le ultime modifiche chat.
- Allineamento local/deploy: il runtime usa sorgente DB-first in ambiente reale; fallback locale resta attivo solo in test.
- Eliminati i residui locali `wedding_*` non necessari in bootstrap DB per evitare divergenze local/deploy.
- Introdotto client Supabase dedicato (`src/lib/supabaseClient.ts`) e integrazione completa nel layer storage.
- Storage refactor enterprise senza modifiche di business logic:
  - `src/lib/storage.ts` ridotto a 240 righe.
  - Nuovi moduli: `storageTypes.ts`, `storageRsvpSanitizer.ts`, `storageMappers.ts`.
  - API pubblica invariata (`getContent`, `saveContent`, `getRSVPs`, `getMyRSVP`, `saveMyRSVP`, ecc.).
- Layout utente semplificato su richiesta:
  - menu a tendina rimosso dalla sezione user;
  - pulsante `Home` (senza contorno) posizionato al posto del menu toggle;
  - switch `USER/ADMIN` sempre visibile in tutte le pagine, inclusa Intro.
- RSVP aggiornato con modale post-conferma per download invito (PNG) e accesso rapido al pass digitale.
- Tipografia uniformata: solo `Cormorant Garamond` per heading/titoli e `Jost` per il resto.
- Home: testo di benvenuto impostato a `15px`.
- Test suite riallineata alle nuove regole runtime/UI (nessuna logica business alterata).
- Verifiche qualità complete eseguite con esito verde:
  - `typecheck` OK
  - `lint` OK
  - `test` OK (13/13)
  - `build` OK
- SQL/Supabase: in questo ciclo non sono stati introdotti cambi schema DB; quindi nessun nuovo script SQL necessario.

## Aggiornamento Enterprise Finale (2026-04-08 — ciclo finale realtime + RSVP)

- Audit completo rieseguito con qualità verde: `lint`, `typecheck`, `test`, `build` OK.
- Verificata soglia file funzionali: nessun file oltre 350 righe (`RSVP.tsx` 321, `storage.ts` 310).
- Abilitata sincronizzazione realtime in Admin (`Gestione Invitati`) via subscription Supabase su `public.rsvps`.
- Corretto errore TypeScript nel cleanup channel realtime (`supabase` nullable guard).
- RSVP esteso a doppio esito mantenendo UX coerente:
  - conferma presenza con modale di conferma pre-invio,
  - non partecipazione con flusso dedicato (solo nome/cognome),
  - nome/cognome normalizzati con iniziali maiuscole anche per composti.
- Admin RSVP allineato al nuovo stato:
  - evidenza visiva rossa per `Non partecipa`,
  - doppia conferma modale prima dell'eliminazione,
  - filtri smart tra riepilogo e cards (`A-Z/Z-A`, `Tutti/Confermati/Eliminati`),
  - pulsante elimina ridotto a sola icona cestino rossa senza bordo/testo.
- Riepilogo Admin aggiornato a due box (`Adulti`, `Under 18`) senza icone.
- Intro aggiornata: switch `USER/ADMIN` non visualizzato nella schermata intro.
- Invito scaricato da RSVP allineato alla intro in versione standard generica:
  - nessun nominativo ospite,
  - testo finale: `Invito da presentare a Palazzo Isolani.`
- Admin Settings pulito:
  - rimosso box `Invito / Pass`,
  - rimosso campo `BIC / SWIFT`,
  - rimosso campo `Testo` della sezione regalo non presente nel runtime utente.
- IBAN aggiornato a formato compatto senza spazi (migliore copia/incolla bonifico) con normalizzazione centralizzata.
- Deadcode scan rieseguito: restano solo export non critici fuori flusso runtime principale.
- SQL necessario introdotto in questo ciclo:
  - `ALTER TABLE public.rsvps ADD COLUMN attending boolean not null default true;`
  - `ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvps;`
