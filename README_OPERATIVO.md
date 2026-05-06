# README OPERATIVO

Questo file e il punto di ingresso operativo per l'agent.

## Regole di lettura

1. Leggere prima questo file.
2. Leggere poi solo i file `DNA/` pertinenti al task.
3. Verificare sempre il codice reale prima di modificare qualcosa.
4. Trattare `DNA/` come contesto operativo canonico, non come sostituto del codice.
5. Trattare `DNA/STORICO/` e i report storici come secondari.
6. Non creare documentazione parallela con lo stesso scopo.
7. Aggiornare `DNA/` quando cambia un flusso reale, un vincolo, una integrazione o un workflow operativo.

## Mappa canonica

- `DNA/01_ARCHITETTURA_REALE.md`
  - monorepo, package attivi, entrypoint, superfici runtime da considerare autorevoli.
- `DNA/02_FLUSSI_CRITICI.md`
  - intro/home, RSVP, pass, admin, contenuti editabili, flussi che non vanno rotti.
- `DNA/03_DATI_INTEGRAZIONI.md`
  - storage, Supabase, Google Sheet backup, env rilevanti, servizi esterni.
- `DNA/04_OPERATIONS.md`
  - comandi reali, verifica qualità, avvio locale, backup, runbook collegati.
- `DNA/05_GUARDRAILS.md`
  - decisioni già prese, regole non negoziabili, cose da non duplicare o cambiare senza richiesta.

## Runbook specialistici da leggere solo se servono

- `scripts/google-sheet/README.md`
  - overview tecnica del mirror RSVP -> Google Sheet.
- `report/SETUP_RSVP_GOOGLE_SHEET_BACKUP.md`
  - setup operativo iniziale.
- `report/RESTORE_RSVP_GOOGLE_SHEET_BACKUP.md`
  - procedura di restore da CSV Google Sheet.
- `report/SUPABASE_KEEPALIVE_REPORT.md`
  - keepalive esterno via GitHub Actions.
- `backup/README.md`
  - policy backup locale e comando canonico.

## Materiale storico

- `DNA/STORICO/`
  - audit, report incrementali, note di allineamento e documentazione una tantum.
- Non usare `DNA/STORICO/` come fonte primaria se il codice attuale dice altro.

## Regole operative rapide

- Runtime frontend autorevole: `artifacts/wedding-app`.
- Route admin reale: `/admina` e `/admina/settings`, non `/admin`.
- Source of truth applicativa corrente:
  - contenuti e RSVP via layer `artifacts/wedding-app/src/lib/storage.ts`;
  - database reale via Supabase quando le env `VITE_SUPABASE_*` sono presenti;
  - fallback locale mantenuto per casi senza config e per parte del test/runtime locale.
- L'API server esiste, ma oggi espone solo `/api/healthz`; non assumere un backend business attivo senza verificare il codice.
- `artifacts/mockup-sandbox` non e runtime wedding: usarlo solo per task esplicitamente legati al sandbox.

## Workflow Git / GitHub

Workflow canonico per pubblicare lo stato del progetto:

1. `git status --short --branch`
2. eseguire i controlli minimi sensati (`typecheck`, `test`, `build` se rilevante)
3. creare backup se richiesto o prima di operazioni importanti
4. `git add` solo dei file intenzionali
5. `git commit -m "<messaggio-chiaro>"`
6. verificare branch con `git branch --show-current`
7. push con `git push origin main` quando il branch target richiesto e `main`

Regole:

- non pubblicare cambi non capiti;
- non dare per scontato che tutto il worktree sia nello scope del commit;
- se il repository exportato mantiene questo file, l'agent deve usare questa procedura come default finche il progetto non documenta altro.

## Quando aggiornare `DNA/`

Aggiornare `DNA/` se cambia almeno una di queste aree:

- architettura runtime reale;
- flusso RSVP/admin/pass;
- storage o integrazioni esterne;
- workflow operativo di avvio, test, backup o deploy;
- vincoli/decisioni che un agent deve rispettare per non rompere il progetto.
