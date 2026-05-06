# Architettura Reale

## Scopo

Mappa minima e stabile del progetto reale. Il codice resta la fonte di verità.

## Monorepo

Workspace `pnpm` con package principali:

- `artifacts/wedding-app`
  - frontend principale React 19 + Vite + Tailwind 4.
- `artifacts/api-server`
  - server Express 5 separato.
- `artifacts/mockup-sandbox`
  - sandbox di preview componenti; non fa parte del runtime wedding.
- `lib/api-spec`, `lib/api-client-react`, `lib/api-zod`, `lib/db`
  - librerie shared e codegen; oggi hanno impatto runtime limitato.
- `scripts`
  - script operativi del repository.

## Superfici autorevoli

### Frontend wedding

- Entrypoint: `artifacts/wedding-app/src/main.tsx`
- App root: `artifacts/wedding-app/src/App.tsx`
- Router: `wouter`
- Route reali:
  - `/`
  - `/home`
  - `/rsvp`
  - `/details`
  - `/gift`
  - `/pass`
  - `/admina`
  - `/admina/settings`

Note:

- `/` mostra `Intro` oppure `Home` in base a `sessionStorage`.
- La route admin pubblica reale e `/admina`, non `/admin`.

### API server

- Entrypoint: `artifacts/api-server/src/index.ts`
- App: `artifacts/api-server/src/app.ts`
- Stato attuale: espone solo `GET /api/healthz`

Conclusione operativa:

- non assumere backend business attivo lato wedding app;
- il frontend oggi gestisce i flussi business tramite il layer `storage.ts`.

### Sandbox

- Entrypoint: `artifacts/mockup-sandbox/src/App.tsx`
- Plugin locale: `artifacts/mockup-sandbox/mockupPreviewPlugin.ts`

Guardrail:

- non trattare il sandbox come sorgente del runtime wedding;
- non documentare o modificare il sandbox salvo task esplicito su quella superficie.

## Build output

- Frontend wedding: `artifacts/wedding-app/dist/public`
- API server: `artifacts/api-server/dist`
- Sandbox: `artifacts/mockup-sandbox/dist`

## Tecnologie runtime rilevanti

- React 19
- Vite 7
- Tailwind CSS 4
- Wouter
- React Hook Form + Zod
- Supabase JS

## PWA / runtime browser

Il frontend registra un service worker minimale solo in produzione:

- registrazione: `artifacts/wedding-app/src/main.tsx`
- service worker: `artifacts/wedding-app/public/sw.js`

Uso operativo:

- considerare PWA come dettaglio di packaging/browser;
- non assumere logiche offline complesse: il service worker corrente e minimale.
