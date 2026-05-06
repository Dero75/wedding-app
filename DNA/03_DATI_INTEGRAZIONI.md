# Dati e Integrazioni

## Dati applicativi rilevanti

### Contenuti editabili

Tipo canonico: `EditableContent` in `artifacts/wedding-app/src/lib/storageTypes.ts`

Contiene i testi runtime per:

- home
- dettagli evento
- gift / modale IBAN
- pass
- microcopy correlate

Non contiene i dati evento fissi.

### Dati evento fissi

Fonte canonica: `artifacts/wedding-app/src/config/event.ts`

Restano fuori dall'editor admin:

- data matrimonio
- citta
- nomi sposi

### RSVP

Tipo canonico: `RSVPEntry` in `artifacts/wedding-app/src/lib/storageTypes.ts`

Campi:

- `id`
- `firstName`
- `lastName`
- `attending`
- `guestCount`
- `childrenCount`
- `dietaryCounts`
- `submittedAt`

## Storage locale

Layer canonico: `artifacts/wedding-app/src/lib/storage.ts`

Chiavi rilevanti:

- `wedding_content`
- `wedding_rsvps`
- `wedding_my_rsvp`
- `wedding_my_rsvp_id`
- `wedding_admin_pin_unlocked` in `sessionStorage`
- `wedding_admin_rsvp_seen_ids_v2`

Regole:

- non leggere/scrivere localStorage direttamente dai componenti salvo casi gia esistenti e mirati;
- preferire sempre le funzioni pubbliche del layer storage.

## Supabase

Client:

- `artifacts/wedding-app/src/lib/supabaseClient.ts`

Env pubbliche frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Tabelle lette/scritte dal runtime:

- `wedding_content`
- `rsvps`

Comportamento:

- il frontend usa Supabase direttamente quando le env sono presenti;
- l'admin usa realtime subscription sulla tabella `public.rsvps`.

## Google Sheet backup RSVP

Ruolo:

- mirror di backup, non source of truth primaria.

Pipeline reale:

- `public.rsvps` su Supabase
- trigger SQL
- webhook Apps Script
- tab Google Sheet `RSVP_BACKUP`

File tecnici:

- `scripts/google-sheet/wedding_rsvp_backup_core.gs`
- `scripts/google-sheet/supabase_rsvp_google_sheet_sync.sql`
- `scripts/google-sheet/restore_rsvps_from_google_sheet_backup.sql`

Runbook:

- `scripts/google-sheet/README.md`
- `report/SETUP_RSVP_GOOGLE_SHEET_BACKUP.md`
- `report/RESTORE_RSVP_GOOGLE_SHEET_BACKUP.md`

Vincolo critico:

- `DELETE FROM public.rsvps` si propaga al foglio;
- `TRUNCATE` non si propaga via trigger row-level.

## Keepalive Supabase

Script:

- `scripts/supabase-keepalive.mjs`

Workflow:

- `.github/workflows/supabase-keepalive.yml`

Scopo:

- ping esterno giornaliero per ridurre il rischio di pausa del progetto Supabase Free.

## Env operative da ricordare

Frontend / runtime pubblico:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GOOGLE_SHEET_RSVP_BACKUP_URL`

Script / CI:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Guardrail:

- `.env.example` puo contenere valori pubblici o placeholder di configurazione;
- verificare sempre il codice e il contesto prima di trattare una variabile come segreto o come config pubblica.
