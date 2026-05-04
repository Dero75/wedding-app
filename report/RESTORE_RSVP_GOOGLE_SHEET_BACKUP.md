# RESTORE RSVP da Google Sheet Backup

Data: 2026-05-04

## Obiettivo

Ripristinare `public.rsvps` da un export CSV del tab Google Sheet `RSVP_BACKUP` quando Supabase o la tabella RSVP hanno dati mancanti/corrotti.

## Stato backup

- Source of truth runtime: `public.rsvps`.
- Backup esterno: Google Sheet tab `RSVP_BACKUP`.
- Script restore versionato: `scripts/google-sheet/restore_rsvps_from_google_sheet_backup.sql`.

## Procedura sicura

1. Esporta `RSVP_BACKUP` da Google Sheet come CSV.
2. In Supabase SQL Editor esegui PHASE 1 dello script restore.
3. Importa il CSV nella tabella `private.rsvp_google_sheet_restore_staging`.
4. Esegui PHASE 2 e controlla:
   - `invalid_rows = 0`;
   - totali coerenti con Google Sheet.
5. Solo dopo verifica, esegui PHASE 3.

## Strategia restore

- Modalita: `UPSERT` su `public.rsvps`.
- Nessuna cancellazione automatica di record esistenti.
- Gli assenti vengono ripristinati con:
  - `attending=false`;
  - `guest_count=1` per compatibilita vincolo DB/runtime;
  - `children_count=0`;
  - dieta a zero.
- In Admin gli assenti continuano a contare come `0` persone per adulti/under/diete.

## Colonne richieste dal CSV

```text
id,nome,cognome,stato,adulti,under,vegetariani,celiaci,totale_persone,updated_at
```

## Validazioni incluse

Lo script blocca operativamente il restore finche PHASE 2 non risulta pulita:

- `id` presente;
- nome/cognome almeno 2 caratteri;
- `stato` riconosciuto;
- conteggi numerici tra 0 e 10;
- confermati con almeno 1 adulto;
- vegetariani/celiaci non superiori al totale ospiti;
- `updated_at` in formato riconosciuto.

## Note critiche

- Non usare `TRUNCATE` su `public.rsvps` se vuoi propagare cancellazioni al mirror Google Sheet.
- Per svuotamenti controllati usare `DELETE FROM public.rsvps`, dopo backup e verifica.
- Prima di un restore reale, esportare sempre lo stato corrente di `public.rsvps`.

## Verifica post-restore

Eseguire conteggi su `public.rsvps` e confrontarli con il CSV:

```sql
select
  count(*) as total_rsvps,
  sum((attending = true)::int) as confermati,
  sum((attending = false)::int) as assenti,
  sum(case when attending then guest_count else 0 end) as adulti_confermati,
  sum(case when attending then children_count else 0 end) as under_confermati,
  sum(case when attending then coalesce((dietary_counts->>'vegetarian')::int, 0) else 0 end) as vegetariani,
  sum(case when attending then coalesce((dietary_counts->>'celiac')::int, 0) else 0 end) as celiaci
from public.rsvps;
```
