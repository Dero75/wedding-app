# 02 — Pages and Navigation

## Routes

| Route | Page | Description |
|---|---|---|
| `/` | Intro | Fullscreen splash. Auto-advances after ~3.8s or on tap. Reads `getContent()` for names/date. |
| `/home` | Home | Hero + welcome + countdown + CTA. Respects visibility toggles from AdminSettings. |
| `/rsvp` | RSVP | Form (name, attending, count, dietary, message). Explicit attending choice required. Confirmation card with edit. |
| `/details` | Details | Day timeline + ceremony/reception cards with venue photos. Reads `getContent()` for place/time/notes. |
| `/gift` | Gift | IBAN display with copy-to-clipboard. Reads `getContent()` for gift text and IBAN. |
| `/pass` | EntrancePass | Premium dark pass card. Requires RSVP attendance = true. Shows locked state with preview ghost if not attending. |
| `/admin` | Admin | Protected by PIN gate. Full admin: presets, visibility, content editor, PIN change, RSVP list. |

## Navigation (Layout.tsx)

- Fixed top header: "D & D" monogram + hamburger icon
- Slide-in right drawer (300px, duration-300 ease-in-out)
- Active link: `text-accent` (adapts to all presets)
- Overlay backdrop closes drawer on tap
- Admin link at drawer bottom (small, muted — not prominent)

## Flow

```
/ (Intro) ──auto/tap──▶ /home ──▶ /rsvp
                              ──▶ /details
                              ──▶ /gift
                              ──▶ /pass  (locked if no RSVP)
                              ──▶ /admin (PIN protected)
```

## Mobile-first notes

- `max-w-lg mx-auto` on all PageContainers
- All buttons: `rounded-full`, min 44px touch target, `active:scale-[0.97]`
- `-webkit-tap-highlight-color: transparent` on html
- Forms: `inputMode="numeric"` on PIN, `inputMode` hints on form fields
- Conditional field rendering in RSVP (guest count / dietary only shown when "attending = yes")
