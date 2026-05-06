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

## Aggiornamento Operativo (2026-05-04 - snapshot RSVP e implicazioni restore)

- Analizzato report SQL ricevuto per gli ultimi record `public.rsvps`.
- Dataset riportato al momento della verifica:
  - `1777900852201-tc8st0e`, Paolo Casale, `Confermato`, 2 adulti, 0 under, 0 vegetariani, 0 celiaci.
  - `1777907921361-xgcsl3a`, Gloria Balducci, `Confermato`, 1 adulto, 0 under, 0 vegetariani, 0 celiaci.
- Totali dedotti dal report: 2 record, 2 confermati, 0 assenti, 3 adulti, 0 under, 0 vegetariani, 0 celiaci.
- Questi dati sono compatibili con il formato del mirror `RSVP_BACKUP`:
  - `id` -> `id`;
  - `first_name` -> `nome`;
  - `last_name` -> `cognome`;
  - `attending=true` -> `stato=Confermato`;
  - `guest_count` -> `adulti`;
  - `children_count` -> `under`;
  - `dietary_counts.vegetarian` -> `vegetariani`;
  - `dietary_counts.celiac` -> `celiaci`.
- Il report fornito non include verifica live del trigger `trg_rsvps_google_sheet_sync`, delle risposte `net._http_response` o delle chiavi `private.runtime_config`; nessuna conclusione nuova su webhook/backfill va quindi tratta da questo solo output.
- Prossimo hardening consigliato: aggiungere script versionato di restore da CSV/staging Google Sheet verso `public.rsvps`, con modalità `upsert` e validazione dati prima della scrittura.

## Aggiornamento Operativo (2026-05-04 - webhook OK e restore versionato)

- Ricevuto report `net._http_response` con ultimi webhook Google Sheet:
  - id `36`, `35`, `34`, `33`, `32`;
  - tutti con `status_code=200`;
  - tutti con `timed_out=false`;
  - tutti con `error_msg=null`.
- Stato dedotto: la pipeline webhook recente `Supabase -> Apps Script -> Google Sheet` risponde correttamente almeno sugli ultimi eventi osservati.
- Aggiunto script versionato `scripts/google-sheet/restore_rsvps_from_google_sheet_backup.sql`.
- Aggiunta guida operativa `report/RESTORE_RSVP_GOOGLE_SHEET_BACKUP.md`.
- Restore progettato in tre fasi:
  - creazione/clear staging table `private.rsvp_google_sheet_restore_staging`;
  - preview e validazione CSV;
  - `UPSERT` su `public.rsvps` solo dopo verifica manuale.
- Nessuno script SQL di modifica e stato eseguito sul DB in questo ciclo.

## Aggiornamento Operativo (2026-05-04 - accesso rapido al foglio da Admin)

- Aggiunto accesso rapido al Google Sheet backup dalla schermata Admin Settings.
- Configurazione runtime frontend tramite `VITE_GOOGLE_SHEET_RSVP_BACKUP_URL`.
- Sicurezza operativa:
  - `.env.example` contiene solo placeholder;
  - `.env` locale contiene il link reale ed e ignorato da Git;
  - il deploy deve definire la stessa variabile ambiente per rendere attivo il pulsante in produzione.
- La modifica non altera la pipeline `public.rsvps -> pg_net -> Apps Script -> RSVP_BACKUP` e non introduce scritture dirette dal frontend al foglio.
