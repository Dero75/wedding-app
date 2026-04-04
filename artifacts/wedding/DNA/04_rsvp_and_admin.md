# 04 — RSVP and Admin

## RSVP flow

1. Guest opens `/rsvp`
2. Fills form: name, attending (yes/no), guest count, dietary notes, message
3. On submit:
   - Entry saved to `wedding_rsvps` (array, all RSVPs)
   - Entry saved to `wedding_my_rsvp` (their personal entry)
4. Confirmation screen shown with edit button
5. Guest can return and update their RSVP at any time

## RSVPEntry type

```typescript
interface RSVPEntry {
  id: string;              // timestamp-based unique ID
  fullName: string;
  attending: boolean;
  guestCount: number;
  dietaryNotes: string;
  message: string;
  submittedAt: string;     // ISO 8601 date string
}
```

## localStorage keys

| Key | Content |
|---|---|
| `wedding_rsvps` | `RSVPEntry[]` — all submitted RSVPs |
| `wedding_my_rsvp` | `RSVPEntry \| null` — this guest's own RSVP |
| `wedding_admin_settings` | `AdminSettings` — admin panel preferences |

## Admin panel (`/admin`)

### Counters displayed
- Total RSVP responses
- Guests attending (confirmed)
- Total guest count (sum of guestCount for attending entries)

### Style presets
- **ivory** — current warm ivory / dusty rose palette (default)
- **blush** — deeper rose tones (future implementation)
- **dark** — dark moody palette (future implementation)
- Preset choice saved to localStorage, read on reload

### Visibility toggles
- Show/hide couple photo section
- Show/hide gift/IBAN section  
- Show/hide digital entrance pass

### RSVP list
- All entries displayed with name, attendance, guest count, dietary notes, message
- Each entry has a delete button
- Refresh button re-reads from localStorage

## Supabase migration plan

See `05_future_supabase_plan.md` for the migration path. In short: replace `getRSVPs()`, `saveRSVP()`, `deleteRSVP()` with Supabase client calls in `src/lib/storage.ts`. No page components need to change.
