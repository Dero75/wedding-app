# 02 — Pages and Navigation

## Routes

| Route      | Page         | Description                                                                                                       |
| ---------- | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| `/`        | Intro        | Fullscreen splash. Auto-advances after ~3.8s or on tap. Reads `getContent()` for names/date.                      |
| `/home`    | Home         | Hero + welcome + CTA. Always visible (no admin visibility toggles).                                             |
| `/rsvp`    | RSVP         | Form confirm-only (nome, cognome, adulti confermati, persone <18, esigenze alimentari con quantità). Confirmation card with edit. |
| `/details` | Details      | Day timeline + ceremony/reception cards with venue photos. Reads `getContent()` for place/time/notes.             |
| `/gift`    | Gift         | IBAN display with copy-to-clipboard. Reads `getContent()` for gift text and IBAN. Always reachable. |
| `/pass`    | EntrancePass | Premium dark pass card. Available only when a valid RSVP confirmation exists. Route always reachable. |
| `/admin`   | Admin        | Admin home focused on RSVP stats/list.                                                                              |
| `/admin/settings` | AdminSettings | Editor testi/contenuti.                                                                        |

## Navigation (Layout.tsx)

- Fixed top header: home label + hamburger icon on public routes
- In area admin (`/admin*`) hamburger hidden; on `/admin` top-right button is settings shortcut
- DEV only: compact `USER/ADMIN` switch can replace the header home label on `/home` and `/admin`
- Slide-in right drawer (300px, duration-300 ease-in-out)
- Active link: `text-accent` (coerente col tema canonico)
- Overlay backdrop closes drawer on tap
- `Regalo` e `Invito` sono sempre presenti nel menu principale
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
- RSVP includes dedicated selector for people under 18 (`childrenCount`)

## Aggiornamento Allineamento Finale (2026-04-04)

- Verificata coerenza runtime/documentazione con stato codice corrente.
- Admin: in area `/admin*` hamburger nascosto; su `/admin` resta shortcut impostazioni.
- Admin home: KPI unico `Confermati`.
- Admin settings: editor contenuti in box bianchi separati per sezione frontend.
- RSVP: header ridotto al solo titolo; select `Minorenni` con label `minorenne/minorenni`.
- Tipografia canonica confermata: titoli serif, UI/testi sans.
- Nessuna nuova logica business introdotta in questo allineamento documentale.
