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

## Aggiornamento Enterprise (2026-05-04 - riallineamento runtime admin, notifiche e backup)

- Eseguito riallineamento documentale completo dello stato corrente del progetto dopo le ultime modifiche runtime.
- Admin `Gestione Invitati` esteso con modifica RSVP da card: click su card apre modale coerente con UI esistente per aggiornare nome, cognome, stato confermato/assente, adulti, under, vegetariani e celiaci.
- Introdotta funzione storage dedicata `updateRSVP()` per aggiornare RSVP admin senza sovrascrivere `my_rsvp` dell utente corrente.
- Accesso admin dalla home utente riallineato: pulsante invisibile centrato nella topbar bianca, modale PIN con codice `2015`, persistenza sessione via `sessionStorage` fino a chiusura app/browser.
- Modale PIN reso mobile touch friendly con tastierino numerico 3x4, pulsante cancella e invio dedicato.
- In area admin resta visibile il pulsante centrale `User` per rientrare nella sezione pubblica.
- Pagina Programma aggiornata con ultimo swatch palette outfit in verde salvia naturale leggermente scuro (`#96aa86`).
- Campanella notifiche admin corretta in modo persistente per browser e PWA mobile: rimossa auto-marcatura iniziale come letto, introdotta chiave `wedding_admin_rsvp_seen_ids_v2`, conteggio calcolato da RSVP non viste e sync tra tab tramite `storage` event.
- Backup RSVP confermato come pipeline esterna operativa: `public.rsvps` Supabase resta source of truth, Google Sheet `RSVP_BACKUP` resta mirror CRUD via trigger `INSERT/UPDATE/DELETE` e Apps Script.
- Restore RSVP da backup Google Sheet analizzato: oggi e possibile ripristinare manualmente via export CSV + staging table + upsert su `public.rsvps`; non esiste ancora script one-click versionato, consigliato come prossimo hardening operativo.
- Verifiche runtime eseguite durante il ciclo: `lint`, `typecheck`, test mirati e suite test completa verdi; suite corrente a 26 test passati.
- Dev server locale confermato attivo su `http://localhost:5001`.
- Nuovo backup locale creato con procedura canonica: `backup/Backup_4 Maggio_20.42.tar.gz` (14.268.080 byte).
