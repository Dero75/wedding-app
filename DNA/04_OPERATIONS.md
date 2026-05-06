# Operations

## Comandi canonici root

### Avvio app wedding locale

- `corepack pnpm run app:start`
- `corepack pnpm run app:status`
- `corepack pnpm run app:stop`
- `corepack pnpm run app:restart`

Implementazione reale:

- script: `scripts/wedding-app-dev-server.sh`
- porta canonica locale: `5001`

### Qualita

- `corepack pnpm run typecheck`
- `corepack pnpm run test`
- `corepack pnpm run build`
- `corepack pnpm run lint`
- `corepack pnpm run deadcode`

Uso consigliato:

- per modifiche logiche: almeno `typecheck` + test rilevanti;
- per cambi ampi o cross-cutting: `typecheck` + `test` + `build`.

## Package-specific

Frontend wedding:

- `corepack pnpm --filter @wedding-app/wedding-app dev`
- `corepack pnpm --filter @wedding-app/wedding-app build`

API server:

- `corepack pnpm --filter @wedding-app/api-server dev`

Nota:

- l'API server non e parte del flusso canonico di avvio del wedding runtime su `5001`.

## Backup locale

Comando canonico:

- `corepack pnpm run backup:new`

Riferimento:

- `backup/README.md`

## Git e GitHub

Workflow operativo minimo persistente:

1. `git status --short --branch`
2. eseguire i controlli minimi adatti allo scope
3. `git add` solo dei file voluti
4. `git commit -m "<messaggio-chiaro>"`
5. verificare branch con `git branch --show-current`
6. push sul target richiesto, per esempio:
   - `git push origin main`

Regole:

- non usare `git add -A` se il worktree contiene materiale non compreso;
- non fare push senza aver verificato remote e branch reali;
- se il repository viene esportato, questa procedura resta il default da seguire salvo istruzioni piu specifiche nel repo stesso.

## Runbook specialistici

Google Sheet:

- overview: `scripts/google-sheet/README.md`
- setup: `report/SETUP_RSVP_GOOGLE_SHEET_BACKUP.md`
- restore: `report/RESTORE_RSVP_GOOGLE_SHEET_BACKUP.md`

Supabase keepalive:

- `report/SUPABASE_KEEPALIVE_REPORT.md`
- workflow: `.github/workflows/supabase-keepalive.yml`

## Deploy e build output

Fatto verificabile dal codice:

- il frontend builda in `artifacts/wedding-app/dist/public`;
- non esiste nel repo un workflow deploy canonico della web app da considerare source of truth operativa.

Regola:

- non documentare procedure deploy non presenti nel repository come se fossero garantite;
- se servono dettagli deploy, verificarli da configurazioni reali o da istruzioni esplicite dell'utente.

## Manutenzione documentale

Quando cambia il progetto:

- aggiornare `README_OPERATIVO.md` se cambia la mappa o il modo corretto di leggere i documenti;
- aggiornare solo il file `DNA/` che governa davvero quella parte;
- non propagare micro-dettagli UI o note narrative in tutta la documentazione.
