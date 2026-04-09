# REPORT RSVP -> Google Sheet Backup

Data: 2026-04-09

## 1) Stato iniziale reale trovato

- Form RSVP e update fluiscono in `artifacts/wedding-app/src/pages/RSVP.tsx`.
- Persistenza runtime centralizzata in `artifacts/wedding-app/src/lib/storage.ts`.
- Con env Supabase presenti, la write primaria e' gia' su `public.rsvps` tramite `upsert`.
- In assenza config/errore, fallback su localStorage.
- `artifacts/api-server` non e' nel flusso RSVP (oggi solo `/api/healthz`).
- Apps Script esistente creava struttura sheet ma senza sync reale con app.

## 2) Problema reale

- Foglio Google non popolato da dati reali.
- Nessun canale applicativo robusto tra source of truth e sheet.
- Possibile popolamento fake su righe vuote (stato derivato da checkbox).

## 3) Architettura implementata

- Scelta: **Supabase -> Apps Script webhook** (mirror backup operativo).
- Motivazione:
  - minimamente invasiva sul runtime app,
  - zero logiche duplicate nel frontend,
  - coerenza con source of truth gia' in Supabase,
  - manutenzione bassa.

## 4) Cosa e' stato aggiunto

- Apps Script enterprise:
  - `scripts/google-sheet/wedding_rsvp_backup_core.gs`
  - `scripts/google-sheet/wedding_rsvp_backup_setup.gs`
- SQL trigger sync:
  - `scripts/google-sheet/supabase_rsvp_google_sheet_sync.sql`
- Documentazione operativa:
  - `scripts/google-sheet/README.md`
  - `report/SETUP_RSVP_GOOGLE_SHEET_BACKUP.md`

## 5) Regole business rispettate

- `stato`: Confermato / Non partecipa da `attending`.
- `totale_persone`: `guest_count + children_count` solo se `attending=true`, altrimenti `0`.
- `totale_diete`: `dietary_vegetarian + dietary_celiac`.
- Upsert per `id` senza duplicati.
- Nessuna generazione di righe fake su righe senza record reale.

## 6) Gestione errori

- Trigger SQL non blocca la write primaria su `rsvps`:
  - in caso webhook failure, la write primaria resta valida.
- Apps Script valida token e payload; risponde JSON con `ok/error`.

## 7) Limiti attuali

- Sync `DELETE` non applicata intenzionalmente (scelta backup-safe).
- Se la fonte e' localStorage-only (senza Supabase attivo), la sync sheet non parte.

## 8) Esito

- Base completa pronta per sync reale in produzione.
- Per attivazione definitiva servono solo:
  - deploy Apps Script Web App,
  - token in Script Properties,
  - esecuzione SQL trigger/backfill in Supabase.
