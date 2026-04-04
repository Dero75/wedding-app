# 05 — Future Supabase Plan

## Why Supabase

The current app uses localStorage only. This is intentional for the first version — it keeps the app simple, offline-capable, and portable. However, for real wedding use, a shared backend is needed so the couple can see all RSVPs in the admin panel, regardless of which device guests use.

## What to keep

- All pages and components stay exactly the same
- The `RSVPEntry` TypeScript type stays the same
- The routing and UX flow stays the same

## What to replace

The only file that needs to change is `src/lib/storage.ts`. Replace the localStorage functions with Supabase client calls:

### Database tables needed

```sql
CREATE TABLE rsvps (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  guest_count INTEGER NOT NULL,
  children_count INTEGER NOT NULL DEFAULT 0,
  dietary_counts JSONB NOT NULL DEFAULT '{"vegetarian":0,"vegan":0,"celiac":0}',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### API surface to implement

```typescript
// Replace these with Supabase calls:
getRSVPs(): Promise<RSVPEntry[]>
saveRSVP(entry: RSVPEntry): Promise<void>
```

### Steps

1. Install `@supabase/supabase-js`
2. Create local env from template:
   - copy `artifacts/wedding/.env.example` to `artifacts/wedding/.env.local`
   - keep `.env.local` untracked (already covered by root `.gitignore`)
3. Create `src/lib/supabaseClient.ts` with the Supabase client
4. Rewrite `src/lib/storage.ts` to be async, using Supabase instead of localStorage
5. Update all callers in pages to `await` the async calls
6. Add Row Level Security to allow public inserts but admin-only reads

## Project credentials registered (future sync)

- `VITE_SUPABASE_URL`: `https://hrwkrytcmehswbhwvdpi.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: configured in `artifacts/wedding/.env.example`

Current status: credentials are stored for future migration planning only. Supabase is not wired into runtime yet.

### Notes

- Keep localStorage as a fallback for offline scenarios or use it for caching
- The admin page should use Supabase Auth/roles to protect sensitive RSVP data
- The `my_rsvp` identity should remain in localStorage so guests can identify themselves

## Aggiornamento Allineamento Finale (2026-04-04)

- Verificata coerenza runtime/documentazione con stato codice corrente.
- Admin: in area `/admin*` hamburger nascosto; su `/admin` resta shortcut impostazioni.
- Admin home: KPI unico `Confermati`.
- Admin settings: editor contenuti in box bianchi separati per sezione frontend.
- RSVP: header ridotto al solo titolo; select `Minorenni` con label `minorenne/minorenni`.
- Tipografia canonica confermata: titoli serif, UI/testi sans.
- Nessuna nuova logica business introdotta in questo allineamento documentale.
