# 01 — Project Overview

## What this is

A mobile-first digital wedding invitation and RSVP web app for **Deborah & Davide**, designed to run directly in any smartphone browser with no app installation required.

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Language | TypeScript |
| Routing | Wouter |
| Styling | Tailwind CSS v4 |
| Forms | react-hook-form + zod |
| Animation | tw-animate-css + CSS transitions |
| Persistence | localStorage only |
| State | React useState (no global store) |

## Design language

- **Color palette**: Warm ivory (#FAF5EE), beige (#F0E6D3), taupe (#C9B99A), dusty rose (#C2878A), warm brown (#8B6F5E), deep brown (#4A3728), sage (#9CAF88)
- **Typography**: Cormorant Garamond (serif, headings), Jost (sans-serif, body)
- **Mood**: Boho / rustic-chic, romantic, warm, refined, premium

## Folder structure

```
artifacts/wedding/
├── src/
│   ├── App.tsx               # Router + providers
│   ├── index.css             # Global theme, CSS variables, Google Fonts import
│   ├── main.tsx              # Entry point
│   ├── config/
│   │   └── content.ts        # All editable content, dates, IBAN, copy
│   ├── lib/
│   │   ├── storage.ts        # localStorage abstraction + RSVP + AdminSettings types
│   │   └── hooks.ts          # useCountdown, useAdminSettings, useLocalStorage
│   ├── components/
│   │   ├── Layout.tsx        # Fixed header + hamburger drawer navigation
│   │   ├── PageContainer.tsx # Max-width wrapper
│   │   ├── SectionTitle.tsx  # Decorated heading with divider
│   │   ├── WeddingButton.tsx # Primary / outline / ghost button variants
│   │   └── WeddingCard.tsx   # White-cream card with soft border
│   └── pages/
│       ├── Intro.tsx         # Fullscreen splash with fade-in
│       ├── Home.tsx          # Hero + countdown + CTA
│       ├── RSVP.tsx          # Full form with localStorage persistence
│       ├── Details.tsx       # Timeline + ceremony/reception cards
│       ├── Gift.tsx          # IBAN display with copy-to-clipboard
│       ├── EntrancePass.tsx  # Digital invitation card (requires RSVP)
│       ├── Admin.tsx         # Local admin panel
│       └── not-found.tsx     # 404
├── DNA/                      # Project documentation
└── attached_assets/          # Wedding venue photos (used via @assets alias)
```

## Supabase readiness

All persistence is isolated in `src/lib/storage.ts` using a consistent `PREFIX + key` pattern. To migrate to Supabase, replace the functions in that file without touching any page or component.
