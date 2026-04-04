# 05 — Future Supabase Plan

## Why Supabase

The current app uses localStorage only. This is intentional for the first version — it keeps the app simple, offline-capable, and portable. However, for real wedding use, a shared backend is needed so the couple can see all RSVPs in the admin panel, regardless of which device guests use.

## What to keep

- All pages and components stay exactly the same
- The `RSVPEntry` and `AdminSettings` TypeScript types stay the same
- The routing and UX flow stays the same

## What to replace

The only file that needs to change is `src/lib/storage.ts`. Replace the localStorage functions with Supabase client calls:

### Database tables needed

```sql
CREATE TABLE rsvps (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER NOT NULL,
  dietary_notes TEXT,
  message TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_settings (
  id TEXT PRIMARY KEY DEFAULT 'singleton',
  style_preset TEXT DEFAULT 'ivory',
  show_couple_photo BOOLEAN DEFAULT TRUE,
  show_gift_section BOOLEAN DEFAULT TRUE,
  show_entrance_pass BOOLEAN DEFAULT TRUE,
  section_titles JSONB
);
```

### API surface to implement

```typescript
// Replace these with Supabase calls:
getRSVPs(): Promise<RSVPEntry[]>
saveRSVP(entry: RSVPEntry): Promise<void>
deleteRSVP(id: string): Promise<void>
getAdminSettings(): Promise<AdminSettings>
saveAdminSettings(settings: AdminSettings): Promise<void>
```

### Steps

1. Install `@supabase/supabase-js`
2. Create `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Create `src/lib/supabaseClient.ts` with the Supabase client
4. Rewrite `src/lib/storage.ts` to be async, using Supabase instead of localStorage
5. Update all callers in pages to `await` the async calls
6. Add Row Level Security to allow public inserts but admin-only reads

### Notes

- Keep localStorage as a fallback for offline scenarios or use it for caching
- The admin page should use Supabase Auth/roles to protect sensitive RSVP data
- The `my_rsvp` identity should remain in localStorage so guests can identify themselves
