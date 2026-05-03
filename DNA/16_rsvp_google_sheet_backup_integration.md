# 16     RSVP Google Sheet Backup Integration (2026-04-10)

## Obiettivo

Rendere Google Sheet un backup operativo reale degli RSVP mantenendo Supabase come source of truth.

## Stato reale consolidato

- Persistenza primaria: `public.rsvps`.
- Backup mirror: tab Google `RSVP_BACKUP`.
- Pipeline attiva: `Supabase trigger -> Apps Script doPost -> upsert/delete sheet`.

## Architettura finale

**Supabase webhook trigger -> Apps Script Web App**

Motivi:
- minima invasivita lato app;
- nessuna modifica UX;
- manutenzione bassa;
- coerenza piena con la source of truth esistente.

## Componenti versionati

- `scripts/google-sheet/wedding_rsvp_backup_core.gs`
  - setup idempotente foglio (10 colonne);
  - lock concorrenza;
  - upsert per `id`;
  - delete per `id`;
  - compattazione righe.
- `scripts/google-sheet/supabase_rsvp_google_sheet_sync.sql`
  - trigger su `INSERT/UPDATE/DELETE`;
  - timeout hardening;
  - backfill throttled.

## Regole dati garantite

- `stato` derivato da `attending`.
- Se `attending=false`: `adulti/under/veg/celiaci/totale_persone = 0` nel foglio mirror.
- Nessun duplicato per `id`.

## Vincolo operativo cruciale

- `DELETE` su `public.rsvps` si propaga al foglio.
- `TRUNCATE` non si propaga (nessun trigger row-level DELETE).

## Esito validazione live

- Sync CRUD verificata end-to-end:
  - INSERT OK
  - UPDATE OK
  - DELETE OK
- Risposte webhook: `200`, `timed_out=false`, `ok:true`.
- Backfill completato con dataset reale.

## Aggiornamento Operativo (2026-04-10 - RSVP Google Sheet CRUD)

- Integrazione Google Sheet consolidata in modalita CRUD: `INSERT`, `UPDATE`, `DELETE`.
- Trigger Supabase aggiornato a `AFTER INSERT OR UPDATE OR DELETE`.
- Apps Script unificato su `scripts/google-sheet/wedding_rsvp_backup_core.gs` con lock concorrenza in `doPost`.
- Backfill stabilizzato con timeout esteso + throttling (`pg_sleep(1.5)`).
- Nota operativa confermata: `TRUNCATE` non propaga delete row-level; usare `DELETE FROM public.rsvps` per svuotamento con sync verso foglio.

## Aggiornamento Operativo (2026-05-03 - verifica integrazione su audit enterprise)

- Verifica SQL diretta su DB progetto completata durante audit enterprise.
- Confermata presenza trigger `trg_rsvps_google_sheet_sync` su eventi `INSERT/UPDATE/DELETE`.
- Confermata presenza chiavi runtime config:
  - `GOOGLE_SHEET_WEBHOOK_URL`
  - `GOOGLE_SHEET_WEBHOOK_TOKEN`
- Nessuna modifica al flusso business o alla pipeline di backup RSVP -> Google Sheet.
