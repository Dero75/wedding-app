# 01 — Project Overview

## What this is

A mobile-first digital wedding invitation and RSVP web app for **Deborah & Davide** (Italian, 14 September 2025, Villa Borgonuovo, Bologna). Runs in any smartphone browser. No app installation required, no backend.

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Routing | Wouter |
| Styling | Tailwind CSS v4 + tw-animate-css |
| Forms | react-hook-form + zod |
| Icons | lucide-react |
| Persistence | localStorage / sessionStorage |
| Fonts | Cormorant Garamond (serif) + Jost (sans) — Google Fonts |

## Language

All user-facing text is in Italian.

## Architecture principles

1. **Single data layer** — all persistence lives in `src/lib/storage.ts`. No page component ever accesses `localStorage` directly.
2. **EditableContent** is the authoritative source for user-facing text. All pages call `getContent()`.
3. **AdminSettings** controls style preset and visibility toggles.
4. **Preset system** — `document.documentElement.dataset.preset` is set to `"ivory" | "blush" | "dark"` on mount by `PresetApplier` in `App.tsx`. CSS variable overrides in `index.css` drive the full visual theme.
5. **PIN gate** — `/admin` is protected by a PIN (default `"1234"`) stored in `localStorage`. Session unlock stored in `sessionStorage`; requires re-entry on new browser session.
6. **Supabase-ready** — swap the implementations in `storage.ts`. Zero page changes needed.

## Folder structure

```
artifacts/wedding/
  src/
    App.tsx               # Router + PresetApplier effect
    index.css             # CSS variables + [data-preset] blocks + Google Fonts import
    pages/                # 7 page components
    components/           # Layout, WeddingButton, WeddingCard, AdminPinGate, Toggle, etc.
    lib/
      storage.ts          # ALL persistence: PIN, EditableContent, AdminSettings, RSVP
      hooks.ts            # useCountdown, useAdminSettings, useLocalStorage
    config/
      content.ts          # Static fallback constants (do not read from here in pages — use getContent())
  DNA/                    # This documentation
  attached_assets/        # 3 venue photos
```
