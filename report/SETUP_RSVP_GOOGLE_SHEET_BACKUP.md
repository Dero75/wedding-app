# SETUP RSVP Google Sheet Backup

## Prerequisiti

- Google Sheet operativo.
- Accesso ad Apps Script del foglio.
- Accesso SQL Editor Supabase.

## Sequenza setup (ordine obbligatorio)

1. **Apps Script**
   - Copia `scripts/google-sheet/wedding_rsvp_backup_core.gs` nel progetto Apps Script.
   - In `Project Settings -> Script Properties`, imposta:
     - `RSVP_WEBHOOK_TOKEN=<token-reale-forte>`
   - Esegui una volta `buildWeddingRsvpBackupSheet()`.

2. **Deploy Web App**
   - `Deploy -> Manage deployments -> Web App -> New version -> Deploy`
   - `Execute as`: `Me`
   - `Who has access`: `Anyone with the link`
   - Copia URL `/exec`.

3. **Supabase SQL**
   - Esegui `scripts/google-sheet/supabase_rsvp_google_sheet_sync.sql`.
   - Aggiorna `private.runtime_config` con URL `/exec` e token reale.

4. **Backfill iniziale**
   - Esegui:
   ```sql
   select public.backfill_rsvps_google_sheet_sync();
   ```

5. **Seed test opzionale (20 record misti)**
   - Esegui: `scripts/google-sheet/rsvp_seed_mixed_20.sql`

## Test manuale minimo

1. INSERT RSVP -> compare una riga nel foglio.
2. UPDATE stesso RSVP -> stessa riga aggiornata (stesso `id`).
3. DELETE RSVP -> riga eliminata nel foglio.

## Comandi utili di controllo

```sql
select key, value
from private.runtime_config
where key in ('GOOGLE_SHEET_WEBHOOK_URL', 'GOOGLE_SHEET_WEBHOOK_TOKEN')
order by key;
```

```sql
select id, status_code, timed_out, error_msg
from net._http_response
order by id desc
limit 20;
```

## Nota importante (svuotamento)

Per propagare cancellazioni al foglio, usare:

```sql
delete from public.rsvps;
```

Non usare `truncate table public.rsvps;` se vuoi svuotamento automatico del foglio.
