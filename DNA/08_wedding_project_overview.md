# 01 — Project Overview

## What this is

A mobile-first digital wedding invitation and RSVP web app for **Deborah & Davide** (Italian, fixed event date: **Venerdi 11 Settembre 2026**, Villa Borgonuovo, Bologna). Runs in any smartphone browser. No app installation required, no backend.

## Stack

| Layer       | Technology                                              |
| ----------- | ------------------------------------------------------- |
| Framework   | React 19 + Vite + TypeScript                            |
| Routing     | Wouter                                                  |
| Styling     | Tailwind CSS v4 + tw-animate-css                        |
| Forms       | react-hook-form + zod                                   |
| Icons       | lucide-react                                            |
| Persistence | localStorage                                            |
| Fonts       | Cormorant Garamond (serif) + Jost (sans) — Google Fonts |

## Language

All user-facing text is in Italian.

## Architecture principles

1. **Single data layer** — all persistence lives in `src/lib/storage.ts`. No page component ever accesses `localStorage` directly.
2. **EditableContent** is the authoritative source for user-facing text except event date, which is fixed in `src/config/event.ts`. All pages call `getContent()` for editable copy.
3. **AdminSettings** controls only editable text/content.
4. **Single visual theme** — the app uses one canonical `Avorio Classico` theme; no runtime preset switching.
5. **Admin direct access** — `/admin` is directly available (no PIN gate).
6. **RSVP model** — confirm-only with structured fields (`firstName`, `lastName`, `guestCount`, `childrenCount`, `dietaryCounts`).
7. **Supabase-ready** — swap the implementations in `storage.ts`. Zero page changes needed.

## Folder structure

```
artifacts/wedding-app/
  src/
    App.tsx               # Router + startup sanitizers
    index.css             # Canonical Avorio CSS variables + Google Fonts import
    pages/                # Page components (+ /admin and /admin/settings)
    components/           # Layout, WeddingButton, WeddingCard, Toggle, etc.
    lib/
      storage.ts          # ALL persistence: EditableContent, RSVP (+ legacy cleanup helpers)
    config/
      event.ts            # Fixed event constants (date/city labels)
    pages/admin/          # Admin page submodules
    pages/rsvp/           # RSVP page submodules
    components/ui/        # Canonical runtime UI set: toast, toaster, tooltip
DNA/                      # Technical documentation (repository root)
attached_assets/          # Venue photos
```

## Aggiornamento Allineamento Finale (2026-04-04)

- Verificata coerenza runtime/documentazione con stato codice corrente.
- Admin: in area `/admin*` hamburger nascosto; su `/admin` resta shortcut impostazioni.
- Admin home: KPI unico `Confermati`.
- Admin settings: editor contenuti in box bianchi separati per sezione frontend.
- RSVP: header ridotto al solo titolo; select `Minorenni` con label `minorenne/minorenni`.
- Tipografia canonica confermata: titoli serif, UI/testi sans.
- Nessuna nuova logica business introdotta in questo allineamento documentale.

## Aggiornamento Operativo Finale (2026-04-04)

- Verifiche complete rieseguite: install/ typecheck/ lint/ build/ test tutti OK.
- Rimozione completa logica `vegano` dal runtime RSVP (config, schema, form, storage, test).
- Etichette alimentari aggiornate: `Vegetariani`, `Celiaci`.
- Home ottimizzata: data fissa `Venerdi 11 Settembre 2026`, nome coppia e città centrati con interspazi ridotti; separatore senza icona cuore.
- Dettagli (`Cerimonia`/`Ricevimento`) compattati ~20% mantenendo stile/layout canonico.
- Header admin consolidato: `Home` a sinistra, switch USER/ADMIN centrato, hamburger assente in `/admin*`.
- Stabilità dev server migliorata: avvio detached affidabile in `scripts/wedding-app-dev-server.sh` per evitare stop intermittenti su `5001`.
- Nessuna modifica di business logic; solo consolidamento tecnico e coerenza runtime/documentazione.

## Aggiornamento Enterprise Finale (2026-04-07)

- Eseguito hardening completo runtime con qualità verde (`typecheck`, `lint`, `test`, `build`, `deadcode`).
- Confermata assenza di file funzionali oltre soglia 350 righe.
- Deploy Cloudflare Pages validato (build monorepo `@wedding-app/wedding-app`, output `artifacts/wedding-app/dist/public`).
- Variabili Supabase aggiornate ai nuovi valori progetto (`hbmccalscnescpvomrjo`).
- Intro aggiornata: rimossi i testi "il matrimonio di" e "tocca per entrare"; durata auto a 4.5s.
- Header home aggiornato: pulsante/label `Home` non mostrato su route `/home`.
- Switch `USER/ADMIN` reso visibile anche in deploy (non solo DEV) su `/home` e `/admin*`.
- Home aggiornata senza cambiare business logic: pulsanti CTA ridotti al 70% larghezza; blocco testi principale aumentato del 25%; data/città uniformate a 10px.
- Tipografia UI uniforme: tracking caratteri standardizzato a `tracking-wider` dove applicabile.
- Testi da Admin ora rispettano i ritorni a capo in rendering (`whitespace-pre-line`) mantenendo allineamenti correnti.
- Pagina Programma estesa con sezione contributo + modale IBAN (copia/intestatario) mantenendo coerenza visiva.
- Nessuna modifica alle logiche di business (RSVP confirm-only, pass gating, flussi admin).

## Aggiornamento Enterprise (2026-04-08)

- Verificato e consolidato lo stato del runtime dopo le ultime modifiche chat.
- Allineamento local/deploy: il runtime usa sorgente DB-first in ambiente reale; fallback locale resta attivo solo in test.
- Eliminati i residui locali `wedding_*` non necessari in bootstrap DB per evitare divergenze local/deploy.
- Introdotto client Supabase dedicato (`src/lib/supabaseClient.ts`) e integrazione completa nel layer storage.
- Storage refactor enterprise senza modifiche di business logic:
  - `src/lib/storage.ts` ridotto a 240 righe.
  - Nuovi moduli: `storageTypes.ts`, `storageRsvpSanitizer.ts`, `storageMappers.ts`.
  - API pubblica invariata (`getContent`, `saveContent`, `getRSVPs`, `getMyRSVP`, `saveMyRSVP`, ecc.).
- Layout utente semplificato su richiesta:
  - menu a tendina rimosso dalla sezione user;
  - pulsante `Home` (senza contorno) posizionato al posto del menu toggle;
  - switch `USER/ADMIN` sempre visibile in tutte le pagine, inclusa Intro.
- RSVP aggiornato con modale post-conferma per download invito (PNG) e accesso rapido al pass digitale.
- Tipografia uniformata: solo `Cormorant Garamond` per heading/titoli e `Jost` per il resto.
- Home: testo di benvenuto impostato a `15px`.
- Test suite riallineata alle nuove regole runtime/UI (nessuna logica business alterata).
- Verifiche qualità complete eseguite con esito verde:
  - `typecheck` OK
  - `lint` OK
  - `test` OK (13/13)
  - `build` OK
- SQL/Supabase: in questo ciclo non sono stati introdotti cambi schema DB; quindi nessun nuovo script SQL necessario.
