# 16     RSVP Google Sheet Backup Integration (2026-04-09)

## Obiettivo

Rendere Google Sheet un backup operativo reale degli RSVP, mantenendo Supabase come source of truth.

## Stato reale verificato

- Runtime RSVP salva tramite `saveMyRSVP()` in `src/lib/storage.ts`.
- Con config Supabase presente, write primaria su `public.rsvps` via `upsert`.
- `api-server` non gestisce RSVP (solo health route).
- Foglio Google preesistente era solo struttura UI senza flusso dati reale.

## Scelta architetturale

**Supabase -> Apps Script webhook** (trigger SQL `INSERT/UPDATE` su `public.rsvps`).

Motivi:
- non altera UX app,
- evita doppia logica lato frontend,
- mantiene coerenza con persistenza primaria,
- setup e manutenzione semplici.

## Componenti introdotti

- Apps Script:
  - `scripts/google-sheet/wedding_rsvp_backup_core.gs`
  - `scripts/google-sheet/wedding_rsvp_backup_setup.gs`
- SQL trigger sync:
  - `scripts/google-sheet/supabase_rsvp_google_sheet_sync.sql`
- Setup operativo:
  - `scripts/google-sheet/README.md`
  - `report/SETUP_RSVP_GOOGLE_SHEET_BACKUP.md`
  - `report/REPORT_RSVP_GOOGLE_SHEET_BACKUP.md`

## Regole dati garantite

- Upsert per `id` (no duplicati).
- Derivati coerenti:
  - `stato` da `attending`
  - `totale_persone` = `guest_count + children_count` solo se `attending=true`, altrimenti `0`
  - `totale_diete` = `dietary_vegetarian + dietary_celiac`
- Nessun popolamento fake su righe senza record reale.

## Note operative

- Sync copre `INSERT` + `UPDATE`.
- Delete non sincronizzato hard per preservare backup.
- In errore webhook, la write primaria su Supabase non viene bloccata.

## Aggiornamento Operativo (2026-04-09 sera - debug live completato)

- Validata la catena reale end-to-end con test manuale su `net.http_post` e risposta webhook `200`.
- Identificato timeout su backfill bulk (`pg_net`), mitigato con:
  - trigger sync con timeout `20000ms`,
  - backfill con timeout `60000ms` + `pg_sleep(1.5)` tra richieste.
- Apps Script hardening applicato:
  - upsert su prima riga `id` libera (niente append su `lastRow`),
  - funzione di compattazione righe sparse per riportare i record in alto.
