# 04 — RSVP and Admin

## RSVP flow

1. Guest opens `/rsvp`
2. Fills form: first name, last name, confirmed adults, people under 18, dietary quantities (Vegetariani/Celiaci)
3. On submit: saved to `wedding_rsvps` (all RSVPs) and `wedding_my_rsvp` (their entry)
4. Confirmation card shown with edit button
5. Guest can return and edit anytime
6. RSVP stays open (no deadline constraint in UI or logic)
7. Runtime model is confirm-only: no explicit decline branch

## RSVPEntry type

```typescript
interface RSVPEntry {
  id: string; // timestamp-based unique ID
  firstName: string;
  lastName: string;
  guestCount: number;
  childrenCount: number; // under 18
  dietaryCounts: { vegetarian: number; celiac: number };
  submittedAt: string; // ISO 8601
}
```

## localStorage keys

| Key                      | Content                                           |
| ------------------------ | ------------------------------------------------- |
| `wedding_rsvps`          | `RSVPEntry[]` — all RSVPs                         |
| `wedding_my_rsvp`        | `RSVPEntry \| null` — this guest's entry          |
| `wedding_content`        | `Partial<EditableContent>` — admin-edited content |
| `wedding_admin_settings` | Legacy key removed automatically at startup        |

## Admin panel (`/admin`)

Admin is split into:

- `/admin` → RSVP-focused home (stats + RSVP list)
- `/admin/settings` → content editor only

### Visibility controls

Removed from Admin and runtime.
All public sections/routes are always active.

### Content editor

Direct content editor grouped in separate white cards by frontend area:

- Home
- Benvenuto
- Bottoni Home
- Programma
- Regalo
- Invito / Pass
- Saves on every keystroke to localStorage
- Pages read from `getContent()` — changes reflect live
- `Nome sposa`/`Nome sposo` were removed from editable fields

### RSVP list

Always-visible scrollable list of RSVP cards:

- Shows only confirmations received
- Per-entry details: confirmed adults, people under 18 (if > 0), dietary quantities (only if > 0)
- No outer container header/toolbar

Admin home summary cards:

- `Confermati` = total confirmed adults (`sum(guestCount)`)

## EditableContent fields

```typescript
interface EditableContent {
  introTagline;
  heroSubtitle;
  weddingTime;
  weddingLocation;
  weddingAddress;
  welcomeTitle;
  welcomeText;
  ctaRSVP;
  ctaDetails;
  ceremonyPlace;
  ceremonyTime;
  ceremonyAddress;
  ceremonyNote;
  receptionPlace;
  receptionTime;
  receptionAddress;
  receptionNote;
  giftTitle;
  giftText;
  giftIBAN;
  giftBIC;
  giftHolder;
  passTitle;
  passSubtitle;
}
```

Note: event date and couple names are fixed at app level and not editable from Admin.

## Aggiornamento Allineamento Finale (2026-04-04)

- Verificata coerenza runtime/documentazione con stato codice corrente.
- Admin: in area `/admin*` hamburger nascosto; su `/admin` resta shortcut impostazioni.
- Admin home: KPI unico `Confermati`.
- Admin settings: editor contenuti in box bianchi separati per sezione frontend.
- RSVP: header ridotto al solo titolo; select `Minorenni` con label `minorenne/minorenni`.
- Tipografia canonica confermata: titoli serif, UI/testi sans.
- Nessuna nuova logica business introdotta in questo allineamento documentale.

## Aggiornamento Operativo Finale (2026-04-04)

- Verifiche complete rieseguite: install/ typecheck/ lint/ build/ test tutti OK.
- Rimozione completa logica `vegano` dal runtime RSVP (config, schema, form, storage, test).
- Etichette alimentari aggiornate: `Vegetariani`, `Celiaci`.
- Home ottimizzata: data fissa `Venerdi 11 Settembre 2026`, nome coppia e città centrati con interspazi ridotti; separatore senza icona cuore.
- Dettagli (`Cerimonia`/`Ricevimento`) compattati ~20% mantenendo stile/layout canonico.
- Header admin consolidato: `Home` a sinistra, switch USER/ADMIN centrato, hamburger assente in `/admin*`.
- Stabilità dev server migliorata: avvio detached affidabile in `scripts/wedding-app-dev-server.sh` per evitare stop intermittenti su `5001`.
- Nessuna modifica di business logic; solo consolidamento tecnico e coerenza runtime/documentazione.
