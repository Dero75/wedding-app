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
