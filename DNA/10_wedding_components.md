# 03 — Components

## Shared components (`src/components/`)

### `Layout`

- Fixed top nav bar (home label + hamburger) + slide-in right drawer
- Drawer lists all 5 main routes + Admin link (bottom, subtle)
- Active link uses `text-accent` (adapts to all presets)
- Local development utility switch (`USER/ADMIN`) can replace the header home label on `/home` and `/admin` only in DEV mode

### `PageContainer`

- `max-w-lg mx-auto px-5 py-10`

### `SectionTitle`

- Optional subtitle (10px caps, `text-muted-foreground`)
- Serif title heading (`text-foreground`)
- Centered gradient divider line using CSS variable border color

### `WeddingButton`

- **primary** — `bg-primary text-primary-foreground`, full rounded pill
- **outline** — `border-border bg-card hover:bg-muted`
- **ghost** — `text-muted-foreground hover:text-foreground hover:bg-muted`
- All variants use semantic Tailwind tokens → automatically adapt to all available presets
- `fullWidth` prop stretches to 100%

### `WeddingCard`

- `bg-card border border-border rounded-2xl shadow-sm`
- All tokens → adapts to all presets

### `Toggle`

- Accessible switch (`role="switch"`)
- `bg-accent` when on, `bg-muted` when off
- Used in Admin visibility toggles

## Page-level internal components (not extracted)

- **RSVP confirmation card** — `RSVP.tsx` — shown after submission (adults + children summary)
- **Day timeline** — `Details.tsx` — vertical timeline with CSS border line
- **Entrance pass card** — `EntrancePass.tsx` — dark premium card with gradient adapting to preset via `--p-pass-bg-from/to` CSS vars
- **IBAN copy block** — `Gift.tsx` — monospace display + clipboard button

## shadcn/ui

Canonical runtime set in `src/components/ui/`:

- `toast.tsx`
- `toaster.tsx`
- `tooltip.tsx`
