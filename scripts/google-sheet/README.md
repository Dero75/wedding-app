# Google Sheet RSVP Backup (Enterprise)

Questa cartella contiene l'integrazione reale per sincronizzare gli RSVP dell'app sul foglio Google.

## Architettura scelta

- **Source of truth**: `public.rsvps` (Supabase) gia' usata dal runtime app.
- **Backup mirror**: Google Sheet (`RSVP_DB`, `Dashboard`, `Istruzioni`).
- **Sync path**: `Supabase trigger -> Apps Script Web App (doPost) -> upsert su RSVP_DB`.

Nessuna doppia logica lato frontend e nessun cambio UX.

## File

- `wedding_rsvp_backup_core.gs`:
  - endpoint `doPost` con token
  - parse payload robusto
  - upsert per `id`
  - refresh dashboard coerente
  - blocco dati fake/righe vuote
- `wedding_rsvp_backup_setup.gs`:
  - setup/idempotenza fogli + stile + validazioni
  - conditional formatting corretta
- `supabase_rsvp_google_sheet_sync.sql`:
  - trigger SQL su `public.rsvps` (insert/update)
  - invio webhook con `pg_net`
  - funzione backfill iniziale

## Setup rapido

1. Apri il Google Sheet e Apps Script.
2. Copia entrambi i file `.gs` nel progetto script.
3. In Apps Script:
   - `Project Settings -> Script Properties`
   - aggiungi `RSVP_WEBHOOK_TOKEN=<token-forte>`
4. Esegui manualmente `buildWeddingRsvpBackupSheet()` una volta.
5. Deploy Apps Script come Web App:
   - Execute as: `Me`
   - Access: `Anyone` (o `Anyone with link`)
   - copia URL `/exec`
6. In Supabase SQL Editor:
   - esegui `supabase_rsvp_google_sheet_sync.sql`
   - sostituisci URL e token placeholders in `private.runtime_config`
7. Esegui backfill:
   - `select public.backfill_rsvps_google_sheet_sync();`

## Test minimo

1. Inserisci o aggiorna un RSVP dall'app.
2. Verifica upsert su `RSVP_DB` (stesso `id`, nessun duplicato).
3. Verifica KPI dashboard.
4. Verifica che non compaiano righe con stato fake su righe vuote.

## Note operative

- Il trigger non blocca la write primaria su `rsvps` in caso errore webhook.
- La sync copre `INSERT` + `UPDATE` (no delete hard per evitare perdita backup involontaria).
- Se necessario azzerare e ricostruire: pulire `RSVP_DB` e rilanciare backfill.
