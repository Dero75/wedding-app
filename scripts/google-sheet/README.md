# Google Sheet RSVP Backup (Enterprise)

Questa cartella contiene l'integrazione reale RSVP -> Google Sheet validata in produzione.

## Architettura

- Source of truth: `public.rsvps` (Supabase).
- Mirror backup: Google Sheet tab `RSVP_BACKUP` (10 colonne operative).
- Flusso: `Supabase trigger (INSERT/UPDATE/DELETE) -> Apps Script Web App doPost -> upsert/delete su RSVP_BACKUP`.

## File

- `wedding_rsvp_backup_core.gs`
  - endpoint `doGet`/`doPost`
  - validazione token (`RSVP_WEBHOOK_TOKEN`)
  - lock concorrenza (`LockService`) per evitare race condition nel backfill
  - upsert per `id` + delete per `id`
  - compattazione righe dopo delete
  - setup idempotente del tab `RSVP_BACKUP`
- `supabase_rsvp_google_sheet_sync.sql`
  - trigger `AFTER INSERT OR UPDATE OR DELETE` su `public.rsvps`
  - invio webhook via `pg_net`
  - backfill throttled (`pg_sleep(1.5)`) con timeout `60000ms`
  - nota operativa: `DELETE` sincronizza, `TRUNCATE` no
- `rsvp_seed_mixed_20.sql`
  - seed SQL pronto con 20 record misti per test end-to-end
- `restore_rsvps_from_google_sheet_backup.sql`
  - procedura versionata per ripristino controllato da export CSV del tab `RSVP_BACKUP`
  - usa staging table `private.rsvp_google_sheet_restore_staging`
  - include preview/validazione prima dell'UPSERT su `public.rsvps`

## Colonne `RSVP_BACKUP`

1. `id`
2. `nome`
3. `cognome`
4. `stato`
5. `adulti`
6. `under`
7. `vegetariani`
8. `celiaci`
9. `totale_persone`
10. `updated_at`

## Setup rapido

1. Copia `wedding_rsvp_backup_core.gs` in Apps Script del foglio.
2. In `Project Settings -> Script Properties` imposta `RSVP_WEBHOOK_TOKEN=<token>`.
3. Esegui una volta `buildWeddingRsvpBackupSheet()`.
4. Deploy Web App (`Execute as Me`, accesso `Anyone with link`) e copia URL `/exec`.
5. Esegui `supabase_rsvp_google_sheet_sync.sql` in Supabase.
6. Aggiorna `private.runtime_config` con URL e token reali.
7. Esegui `select public.backfill_rsvps_google_sheet_sync();`.

## Test minimo obbligatorio

1. INSERT RSVP da app o SQL -> riga creata nel foglio.
2. UPDATE RSVP -> riga aggiornata stesso `id`.
3. DELETE RSVP (`delete from public.rsvps where id=...`) -> riga rimossa nel foglio.

## Restore da backup

Per ripristinare da Google Sheet:

1. Esporta il tab `RSVP_BACKUP` come CSV.
2. Esegui `restore_rsvps_from_google_sheet_backup.sql` PHASE 1 in Supabase.
3. Importa il CSV nella staging table.
4. Esegui PHASE 2 e verifica `invalid_rows = 0`.
5. Esegui PHASE 3 solo dopo controllo dei totali.

Report operativo: `report/RESTORE_RSVP_GOOGLE_SHEET_BACKUP.md`.

## Regola critica

- Se vuoi svuotare anche Google automaticamente, usa:
  - `delete from public.rsvps;`
- Non usare `truncate table public.rsvps;` se vuoi propagazione delete.

## Stato validazione (2026-04-10)

- Sync CRUD confermata live (`status_code=200`, `timed_out=false`).
- Riallineamento storico eseguito con backfill.
- Mismatch precedenti risolti (token/config/timeout/concorrenza/doPost).
