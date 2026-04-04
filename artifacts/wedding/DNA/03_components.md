# 03 — Components

## Reusable components

### `Layout`
**Path**: `src/components/Layout.tsx`
- Wraps all pages except Intro
- Contains the fixed top nav bar and hamburger drawer
- Props: `children: ReactNode`

### `PageContainer`
**Path**: `src/components/PageContainer.tsx`
- `max-w-lg mx-auto px-5 py-10`
- Props: `children`, `className?`

### `SectionTitle`
**Path**: `src/components/SectionTitle.tsx`
- Shows an optional subtitle (small caps, sage color), a serif title, and a centered decorative divider line
- Props: `title`, `subtitle?`, `center? (default true)`

### `WeddingButton`
**Path**: `src/components/WeddingButton.tsx`
- Three variants: `primary` (deep brown, white text), `outline` (taupe border), `ghost` (text only)
- Extends native `button` HTMLAttributes
- Props: `variant?`, `fullWidth?`, plus all standard button props

### `WeddingCard`
**Path**: `src/components/WeddingCard.tsx`
- White/70 background with soft border and rounded corners
- Props: `children`, `className?`

## Page-level components (not reused)

- **Countdown grid** in `Home.tsx` — 4-column grid showing days/hours/min/sec
- **RSVP confirmation state** in `RSVP.tsx` — shown after submission with edit button
- **Day timeline** in `Details.tsx` — vertical timeline with time markers and dot indicators
- **Entrance pass card** in `EntrancePass.tsx` — dark premium card style with guest details
- **IBAN copy block** in `Gift.tsx` — monospace display with clipboard copy icon

## shadcn/ui usage

The scaffold includes shadcn/ui components in `src/components/ui/`. Currently used:
- `@/components/ui/toaster` — toast notifications
- `@/components/ui/tooltip` — tooltip provider wrapper
- All other shadcn components are available but not yet wired up
