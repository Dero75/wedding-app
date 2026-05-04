# Supabase Keepalive Report (2026-05-04)

## Esito

Implementato keep-alive esterno per ridurre il rischio di pausa del progetto Supabase Free per inattivita.

## Perche esterno all'app

Una funzione dentro la web app parte solo quando qualcuno apre il sito. Se nessuno visita l'app per giorni, non puo impedire la pausa. Per questo il ping e schedulato da GitHub Actions.

## Componenti

- `.github/workflows/supabase-keepalive.yml`
  - schedulazione giornaliera `17 3 * * *`;
  - esecuzione manuale tramite `workflow_dispatch`;
  - permessi minimi `contents: read`.
- `scripts/supabase-keepalive.mjs`
  - legge `SUPABASE_URL`/`SUPABASE_ANON_KEY` o `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`;
  - fallback locale su `.env`, `artifacts/wedding-app/.env`, `.env.example` app;
  - effettua una GET REST su `wedding_content?select=id&limit=1`;
  - timeout hard `20000ms`;
  - retry automatico fino a 3 tentativi con backoff breve;
  - nessuna scrittura DB.

## Validazione locale

Comando eseguito:

```bash
node scripts/supabase-keepalive.mjs
```

Risultato:

```text
Supabase keepalive OK: wedding_content.id in 219ms on attempt 1
```

## Configurazione GitHub consigliata

Per massima robustezza configurare nel repository GitHub:

- `Settings -> Secrets and variables -> Actions -> Secrets`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`

In assenza di secrets, lo script puo usare i valori pubblici gia presenti in `artifacts/wedding-app/.env.example`, ma i secrets restano preferibili.

## Limiti

Nessun sistema puo garantire 100% contro pause se GitHub Actions viene disabilitato, sospeso, o se Supabase cambia policy. La soluzione implementata e il controllo piu robusto e non invasivo disponibile senza passare a Supabase Pro.
