# REPORT RSVP -> Google Sheet Backup

Data ultimo aggiornamento: 2026-04-10

## Stato reale consolidato

- Source of truth confermata: `public.rsvps` (Supabase).
- Backup esterno confermato: Google Sheet tab `RSVP_BACKUP`.
- Flusso reale validato: trigger Supabase -> Apps Script Web App -> mirror sheet.

## Problemi individuati e risolti

1. Timeout su backfill massivo (`pg_net`) con timeout basso.
2. Mismatch token runtime (`private.runtime_config` vs Script Properties).
3. URL errata in runtime config (404 verso pagina docs, non endpoint `/exec`).
4. Race condition lato Apps Script durante backfill concorrente.
5. Setup/filtro eseguito dentro `doPost`, con errori sporadici su richieste backfill.
6. Gap funzionale su delete: cancellazioni DB non propagate al foglio.

## Correzioni applicate

- SQL:
  - trigger aggiornato a `AFTER INSERT OR UPDATE OR DELETE`;
  - payload usa `OLD` su `DELETE`, `NEW` su `INSERT/UPDATE`;
  - timeout trigger `20000ms`;
  - backfill timeout `60000ms` + `pg_sleep(1.5)`.
- Apps Script:
  - script unificato su `wedding_rsvp_backup_core.gs`;
  - lock `LockService` in `doPost`;
  - setup idempotente tab `RSVP_BACKUP` (10 colonne essenziali);
  - upsert per `id` + delete per `id` + compattazione righe.
- Pulizia repo:
  - rimosso file obsoleto `scripts/google-sheet/wedding_rsvp_backup_setup.gs`.

## Regole operative confermate

- INSERT: nuova riga nel foglio.
- UPDATE: stessa riga aggiornata per `id`.
- DELETE: riga rimossa nel foglio.
- TRUNCATE: non genera eventi `DELETE` row-level, quindi non svuota automaticamente il foglio.

## Verifiche live completate

- Risposte webhook recenti: `status_code=200`, `timed_out=false`, `ok:true`.
- Test end-to-end eseguito su inserimento, aggiornamento e cancellazione.
- Riallineamento dataset completato con backfill.

## Limiti noti (consapevoli)

- Il trigger non blocca la write primaria su `public.rsvps` in caso di errore webhook (scelta voluta per resilienza runtime app).
- In caso di svuotamento totale con `TRUNCATE`, necessario allineare il foglio manualmente o usare `DELETE`.

## Esito finale

Integrazione backup RSVP su Google Sheet operativa, stabile e coerente con i vincoli enterprise richiesti, senza modifiche a UX o business logic applicativa.
