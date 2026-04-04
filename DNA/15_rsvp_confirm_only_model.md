# 15 — RSVP Confirm-Only Model (2026-04-04)

## Decision

Runtime RSVP model is now confirm-only:

- submitted response = confirmed presence
- no submitted response = not confirmed
- explicit decline branch removed from user/admin/pass runtime

## Runtime changes

- Removed `attending` from canonical `RSVPEntry`.
- Removed free text fields `dietaryNotes` and `message` from canonical `RSVPEntry`.
- Added structured `dietaryFlags` (`vegetarian`, `vegan`, `celiac`).
- Added `childrenCount` for guests under 16.
- RSVP form no longer asks yes/no attendance.
- RSVP page now bootstraps `my_rsvp` once at mount and edits via local state (no per-render storage read loop).
- Pass now depends only on existence of a valid confirmation (`my_rsvp`).
- Admin list and metrics no longer include decline/refusal paths.

## Legacy data sanitization

Handled centrally in `src/lib/storage.ts`:

- `getRSVPs()` drops legacy entries with `attending: false`.
- `getRSVPs()` sanitizes legacy RSVP payloads from `dietaryNotes`/`message` to `dietaryFlags`.
- `getMyRSVP()` clears legacy `my_rsvp` with `attending: false`.
- `getMyRSVP()` sanitizes legacy `my_rsvp` payloads to canonical `dietaryFlags`.
- sanitized snapshots are persisted back to localStorage.

## Admin alignment

- Stats now represent:
  - total responses
  - confirmed adults
  - confirmations with dietary notes
- RSVP list is confirmation-only.

## Tests

- Added `App.rsvp-pass.test.tsx` for:
  - confirm-only RSVP submit/edit flow
  - pass availability based on confirmation existence
- Extended `storage.admin-settings.test.ts` with legacy RSVP sanitization checks.
