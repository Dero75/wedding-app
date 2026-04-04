# 06 — Style System

## Typography

| Role | Font | Weight |
|---|---|---|
| Headings, couple names, titles | Cormorant Garamond | 300–600 |
| Body text, labels, UI | Jost | 300–500 |
| IBAN, monospace | system mono | — |

Loaded via Google Fonts in `index.css` (must be first import before Tailwind).

## Preset system

Three selectable presets, set via `data-preset` attribute on `<html>`:

| Preset | Background | Primary | Accent | Mood |
|---|---|---|---|---|
| `ivory` (default) | Warm ivory `#FAF5EE` | Deep brown `#4A3728` | Dusty rose `#C2878A` | Boho romantic |
| `blush` | Blush `#FDF0F2` | Mauve-rose `hsl(340,45%,35%)` | Deep rose `#C4566A` | Romantic feminine |
| `dark` | Near-black warm `#1C1410` | Gold `hsl(38,55%,62%)` | Deep gold `#C9A15A` | Moody evening luxury |

Each preset block in `index.css` overrides all CSS variables AND the `--p-*` decorator tokens:

```css
[data-preset="blush"] {
  --background: 345 38% 97%;
  --primary: 340 45% 35%;
  --accent: 340 55% 58%;
  /* ... */
  --p-pass-bg-from: #7A2B40;
  --p-hero-from: rgba(100, 45, 55, 0.85);
  /* ... */
}
```

**Decorator tokens** (`--p-*`) are used for elements that can't use Tailwind semantic classes — gradients in the hero, pass card background, intro screen. All pages reference them via `style={{ background: 'var(--p-pass-bg-from)' }}`.

## Semantic tokens (Tailwind)

All shared components (`WeddingButton`, `WeddingCard`, `Layout`, `SectionTitle`, `Toggle`) use Tailwind semantic classes (`bg-primary`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-accent`, etc.) — never hardcoded hex. This ensures every component adapts to all 3 presets without modification.

## Preset application

`App.tsx` mounts a `PresetApplier` effect that:
1. Reads `getAdminSettings().stylePreset`
2. Sets `document.documentElement.dataset.preset = preset`
3. Listens for `storage` and `preset-changed` events to keep in sync

Admin's preset selector dispatches `preset-changed` and directly sets `document.documentElement.dataset.preset` for instant visual feedback.

## Spacing and radius

- Base radius: `0.75rem` (12px)
- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-full`
- Inputs: `rounded-xl`

## Motion

- `animate-in fade-in slide-in-from-bottom-4 duration-500` — confirmation states
- CSS opacity/transform — Intro splash
- `active:scale-[0.97]` — all touch targets
- Toggle knob: `transition-transform duration-200`
