# 02 — Pages and Navigation

## Routes

| Route | Page | Description |
|---|---|---|
| `/` | Intro | Fullscreen splash screen. Auto-advances after ~3.8s or on tap. |
| `/home` | Home | Hero with venue photo, countdown timer, couple welcome text, CTA buttons. |
| `/rsvp` | RSVP | RSVP form. Saves to localStorage. Editable after submission. |
| `/details` | Details | Day timeline + ceremony card + reception card with venue photos. |
| `/gift` | Gift | IBAN display with copy-to-clipboard. |
| `/pass` | EntrancePass | Digital invitation card. Only visible to guests who confirmed attendance. |
| `/admin` | Admin | Local-only admin panel: RSVP list, counters, style presets, visibility toggles. |

## Navigation component

`src/components/Layout.tsx` wraps every page (except Intro) with:
- Fixed top header (44px) with monogram "D & D" and hamburger button
- Slide-in right drawer showing all nav links
- Active link highlighted in dusty rose
- "Admin" link at bottom of drawer (subtle, small)

## Flow

```
/ (Intro) ──auto / tap──▶ /home ──▶ /rsvp
                               ──▶ /details
                               ──▶ /gift
                               ──▶ /pass  (requires RSVP attendance confirmed)
                               ──▶ /admin (always accessible)
```

## Mobile-first notes

- All pages use `max-w-lg mx-auto` for comfortable mobile and desktop reading
- Tap targets are minimum 44px
- Bottom margin on main content prevents content being cut by mobile browser UI
- `webkit-tap-highlight-color: transparent` on html prevents grey flash on iOS tap
