# SETUP RSVP Google Sheet Backup

## Prerequisiti

- Google Sheet gia' creato.
- Accesso Apps Script del foglio.
- Accesso SQL Editor Supabase progetto app.

## Passi

1. **Apps Script**
   - Copia in Apps Script:
     - `scripts/google-sheet/wedding_rsvp_backup_core.gs`
     - `scripts/google-sheet/wedding_rsvp_backup_setup.gs`
   - In `Project Settings -> Script Properties`, imposta:
     - `RSVP_WEBHOOK_TOKEN=<token-forte>`
   - Esegui una volta:
     - `buildWeddingRsvpBackupSheet()`

2. **Deploy Web App**
   - Deploy -> New deployment -> Web app
   - Execute as: `Me`
   - Who has access: `Anyone` (o `Anyone with link`)
   - Copia URL endpoint `/exec`

3. **Supabase SQL**
   - Esegui file:
     - `scripts/google-sheet/supabase_rsvp_google_sheet_sync.sql`
   - Nel blocco `private.runtime_config`, sostituisci:
     - `GOOGLE_SHEET_WEBHOOK_URL`
     - `GOOGLE_SHEET_WEBHOOK_TOKEN`

4. **Backfill iniziale**
   - Esegui:
   ```sql
   select public.backfill_rsvps_google_sheet_sync();
   ```
   - Nota: la versione aggiornata usa timeout alto + throttling per evitare timeout massivi.

## Test manuale (obbligatorio)

1. Crea RSVP da app.
2. Aggiorna stesso RSVP da app.
3. Controlla in `RSVP_DB`:
   - una sola riga per stesso `id`,
   - campi derivati D/F/I/L/N coerenti.
4. Controlla in `Dashboard`:
   - KPI allineati ai record reali.
5. Verifica che non compaiano righe vuote con `Non partecipa`.

## Troubleshooting rapido

- `Token webhook non valido`:
  - mismatch tra JSON `token` e Script Property `RSVP_WEBHOOK_TOKEN`.
- Nessuna scrittura dal trigger:
  - URL/token non valorizzati in `private.runtime_config`.
- Timeout in `net._http_response`:
  - aggiornare funzione trigger con `timeout_milliseconds := 20000`,
  - aggiornare backfill con `timeout_milliseconds := 60000` + `pg_sleep(1.5)`.
- KPI errati:
  - rilancia `refreshWeddingRsvpBackup_()` da Apps Script editor.
- Record scritti su righe troppo alte:
  - aggiornare script Apps Script enterprise,
  - eseguire `buildWeddingRsvpBackupSheet()` che richiama compattazione dati.
