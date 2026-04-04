# 04 — RSVP and Admin

## RSVP flow

1. Guest opens `/rsvp`
2. Fills form: name, attending (explicit choice required), guest count (if attending), dietary notes, message
3. On submit: saved to `wedding_rsvps` (all RSVPs) and `wedding_my_rsvp` (their entry)
4. Confirmation card shown with edit button
5. Guest can return and edit anytime
6. RSVP stays open (no deadline constraint in UI or logic)

## RSVPEntry type

```typescript
interface RSVPEntry {
  id: string; // timestamp-based unique ID
  fullName: string;
  attending: boolean;
  guestCount: number;
  dietaryNotes: string;
  message: string;
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

### Content editor

Accordion section "Testi e contenuti":

- All `EditableContent` fields grouped by page (Home, Programma, Regalo, Invito)
- Saves on every keystroke to localStorage
- Pages read from `getContent()` — changes reflect live

### RSVP list

Accordion section "Lista RSVP (N)":

- All entries with attendance status, count, dietary, message
- Delete per entry
- Refresh button

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
  hashtag;
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
