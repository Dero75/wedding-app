# 03 — Components

## Shared components (`src/components/`)

### `Layout`

- Fixed top nav bar + slide-in right drawer
- Hamburger/menu toggle rendered only on public routes
- Admin routes hide hamburger; `/admin` shows direct settings icon in top-right
- Drawer lists all 5 main routes + Admin link (bottom, subtle)
- Active link uses `text-accent` (tema canonico avorio)
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
- All variants use semantic Tailwind tokens in the single canonical theme
- `fullWidth` prop stretches to 100%

### `WeddingCard`

- `bg-card border border-border rounded-2xl shadow-sm`
- Uses canonical semantic tokens

## Page-level internal components (not extracted)

- **RSVP confirmation card** — `RSVP.tsx` — shown after submission (adults + children summary)
- **Day timeline** — `Details.tsx` — vertical timeline with CSS border line
- **Entrance pass card** — `EntrancePass.tsx` — premium card with gradient using canonical `--p-pass-bg-from/to` tokens
- **IBAN copy block** — `Gift.tsx` — monospace display + clipboard button

## shadcn/ui

Canonical runtime set in `src/components/ui/`:

- `toast.tsx`
- `toaster.tsx`
- `tooltip.tsx`

## Aggiornamento Allineamento Finale (2026-04-04)

- Verificata coerenza runtime/documentazione con stato codice corrente.
- Admin: in area `/admin*` hamburger nascosto; su `/admin` resta shortcut impostazioni.
- Admin home: KPI unico `Confermati`.
- Admin settings: editor contenuti in box bianchi separati per sezione frontend.
- RSVP: header ridotto al solo titolo; select `Minorenni` con label `minorenne/minorenni`.
- Tipografia canonica confermata: titoli serif, UI/testi sans.
- Nessuna nuova logica business introdotta in questo allineamento documentale.
