# 01 — Project Overview

## What this is

A mobile-first digital wedding invitation and RSVP web app for **Deborah & Davide** (Italian, fixed event date: **Venerdi 11 Setttembre**, Villa Borgonuovo, Bologna). Runs in any smartphone browser. No app installation required, no backend.

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
3. **AdminSettings** controls style preset and active section visibility toggles.
4. **Preset system** — `document.documentElement.dataset.preset` is set to `"ivory" | "blush" | "dark"` on mount by `PresetApplier` in `App.tsx`. CSS variable overrides in `index.css` drive the full visual theme.
5. **Admin direct access** — `/admin` is directly available (no PIN gate).
6. **Supabase-ready** — swap the implementations in `storage.ts`. Zero page changes needed.

## Folder structure

```
artifacts/wedding/
  src/
    App.tsx               # Router + PresetApplier effect
    index.css             # CSS variables + [data-preset] blocks + Google Fonts import
    pages/                # 7 page components
    components/           # Layout, WeddingButton, WeddingCard, Toggle, etc.
    lib/
      storage.ts          # ALL persistence: EditableContent, AdminSettings, RSVP
    config/
      event.ts            # Fixed event constants (date/city labels)
    pages/admin/          # Admin page submodules
    pages/rsvp/           # RSVP page submodules
    components/ui/        # Canonical runtime UI set: toast, toaster, tooltip
  DNA/                    # This documentation
  attached_assets/        # Venue photos
```
