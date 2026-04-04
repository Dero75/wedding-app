# 02 — Pages and Navigation

## Routes

| Route      | Page         | Description                                                                                                       |
| ---------- | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| `/`        | Intro        | Fullscreen splash. Auto-advances after ~3.8s or on tap. Reads `getContent()` for names/date.                      |
| `/home`    | Home         | Hero + welcome + CTA. Respects visibility toggles from AdminSettings.                                             |
| `/rsvp`    | RSVP         | Form confirm-only (name, adulti confermati, bambini <16, flag alimentari). Confirmation card with edit. |
| `/details` | Details      | Day timeline + ceremony/reception cards with venue photos. Reads `getContent()` for place/time/notes.             |
| `/gift`    | Gift         | IBAN display with copy-to-clipboard. Reads `getContent()` for gift text and IBAN. Route enabled only if `showGiftSection=true`, otherwise NotFound. |
| `/pass`    | EntrancePass | Premium dark pass card. Available only when a valid RSVP confirmation exists. Route enabled only if `showEntrancePass=true`, otherwise NotFound. |
| `/admin`   | Admin        | Admin home focused on RSVP stats/list.                                                                              |
| `/admin/settings` | AdminSettings | Presets, visibility and content editor.                                                                        |

## Navigation (Layout.tsx)

- Fixed top header: home label + hamburger icon
- DEV only: compact `USER/ADMIN` switch can replace the header home label on `/home` and `/admin`
- Slide-in right drawer (300px, duration-300 ease-in-out)
- Active link: `text-accent` (adapts to all presets)
- Overlay backdrop closes drawer on tap
- `Regalo` link is rendered only when `showGiftSection=true`
- `Invito` link is rendered only when `showEntrancePass=true`
- Admin link at drawer bottom (small, muted — not prominent)

## Flow

```
/ (Intro) ──auto/tap──▶ /home ──▶ /rsvp
                              ──▶ /details
                              ──▶ /gift
                              ──▶ /pass  (locked if no RSVP)
                              ──▶ /admin
```

## Mobile-first notes

- `max-w-lg mx-auto` on all PageContainers
- All buttons: `rounded-full`, min 44px touch target, `active:scale-[0.97]`
- `-webkit-tap-highlight-color: transparent` on html
- Forms: `inputMode` hints on form fields
- RSVP confirm-only form (no explicit decline option in UI)
- RSVP includes dedicated selector for children under 16 (`childrenCount`)
