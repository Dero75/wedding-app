# 06 — Style System

## Typography

| Role | Font | Weight | CSS var |
|---|---|---|---|
| Headings, titles, names | Cormorant Garamond | 300–600 | `--app-font-serif` |
| Body text, UI labels | Jost | 300–500 | `--app-font-sans` |
| Monospace (IBAN) | system mono | — | `--app-font-mono` |

Fonts loaded via Google Fonts in `index.css` (must be first import).

## Color tokens

| Token | Light mode | Usage |
|---|---|---|
| `--background` | `38 55% 97%` — warm ivory | Page background |
| `--foreground` | `20 35% 18%` — deep warm brown | Default text |
| `--primary` | `20 27% 26%` — #4A3728 | Buttons, headings |
| `--accent` | `345 32% 63%` — #C2878A | Dusty rose highlights |
| `--muted-foreground` | `20 22% 45%` — #8B6F5E | Secondary text |
| `--border` | `33 40% 84%` — #E8D9C5 | Card borders, dividers |
| `--card` | `38 50% 99%` — white-cream | Card backgrounds |

## CSS custom properties

All colors are defined as space-separated HSL triplets in `:root` and `.dark` in `src/index.css`. Usage in Tailwind is via `hsl(var(--token))`.

Direct hex values are used in component classNames (e.g. `bg-[#FAF5EE]`) where fine control is needed alongside the theme.

## Spacing and radius

- Base radius: `0.75rem` (12px)
- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-full`
- Base unit: `0.25rem` (4px)

## Shadows

Shadows use warm brown-tinted RGBA values instead of cold black shadows for a more natural, premium look. Defined in `--shadow-*` CSS variables.

## Motion

- Page transitions: Tailwind's `animate-in fade-in slide-in-from-bottom-4` utility classes
- Intro splash: CSS opacity/transform transitions with 700ms delay
- Button press: `active:scale-95` + `transition-all duration-200`
- Toggle switch: `transition-transform` on the knob
- No external animation library required

## Style presets (admin)

Three presets are selectable from the Admin panel:
- **ivory** (default) — warm ivory + dusty rose + deep brown
- **blush** — deeper rose tones (future)
- **dark** — dark moody palette using the `.dark` CSS class (future)

Preset is saved to `wedding_admin_settings` in localStorage.
