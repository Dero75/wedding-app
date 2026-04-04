# 04 — RSVP and Admin

## RSVP flow

1. Guest opens `/rsvp`
2. Fills form: name, confirmed adults, children under 16, dietary flags (Vegetariano/Vegano/Celiaco)
3. On submit: saved to `wedding_rsvps` (all RSVPs) and `wedding_my_rsvp` (their entry)
4. Confirmation card shown with edit button
5. Guest can return and edit anytime
6. RSVP stays open (no deadline constraint in UI or logic)
7. Runtime model is confirm-only: no explicit decline branch

## RSVPEntry type

```typescript
interface RSVPEntry {
  id: string; // timestamp-based unique ID
  fullName: string;
  guestCount: number;
  childrenCount: number; // under 16
  dietaryFlags: DietaryFlag[];
  submittedAt: string; // ISO 8601
}
```

## localStorage keys

| Key                      | Content                                           |
| ------------------------ | ------------------------------------------------- |
| `wedding_rsvps`          | `RSVPEntry[]` — all RSVPs                         |
| `wedding_my_rsvp`        | `RSVPEntry \| null` — this guest's entry          |
| `wedding_admin_settings` | `AdminSettings`                                   |
| `wedding_content`        | `Partial<EditableContent>` — admin-edited content |

## Admin panel (`/admin`)

Admin is split into:

- `/admin` → RSVP-focused home (stats + RSVP list)
- `/admin/settings` → style preset + visibility toggles + content editor

### Style presets

Accordion section "Stile dell'app":

- **Avorio Classico** (ivory) — warm ivory bg, deep brown primary, dusty rose accent
- **Serale Elegante** (dark) — near-black warm bg, gold primary, dark moody

Selecting a preset: saves to `AdminSettings.stylePreset`, sets `document.documentElement.dataset.preset`, dispatches `preset-changed` event.

### Visibility toggles

Accordion section "Visibilità sezioni":

- Sezione benvenuto (welcome section)
- Foto coppia (hero photo)
- Sezione regalo
- Invito digitale

Runtime effects are fully wired:

- `showWelcomeSection`
  - controls Home welcome block rendering
- `showCouplePhoto`
  - controls Home hero image vs plain background
- `showGiftSection`
  - controls `Regalo` link visibility in main navigation
  - controls `/gift` route accessibility (disabled => NotFound)
- `showEntrancePass`
  - controls `Invito` link visibility in main navigation
  - controls `/pass` route accessibility (disabled => NotFound)

### Content editor

Accordion section "Testi e contenuti":

- All `EditableContent` fields grouped by page (Home, Programma, Regalo, Invito)
- Saves on every keystroke to localStorage
- Pages read from `getContent()` — changes reflect live

### RSVP list

Always-visible scrollable list of RSVP cards:

- Shows only confirmations received
- Per-entry details: confirmed adults, children under 16 (if > 0), dietary flags (if selected)
- No outer container header/toolbar

Admin home summary cards:

- `Risposte` = total confirmations saved
- `Confermati` = total confirmed adults (`sum(guestCount)`)
- `Con diete` = confirmations with at least one dietary flag

## EditableContent fields

```typescript
interface EditableContent {
  introTagline;
  heroSubtitle;
  brideName;
  groomName;
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

Note: event date is fixed at app level (`Venerdi 11 Setttembre`) and is not editable from Admin.
