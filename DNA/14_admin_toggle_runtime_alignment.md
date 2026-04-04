# 14 — Admin Toggle Runtime Alignment (2026-04-04)

## Scope

Resolve incoherences between Admin visibility controls and actual wedding runtime behavior.

## Audit summary

Analyzed controls:

- `stylePreset`
- `showCouplePhoto`
- `showWelcomeSection`
- `showGiftSection`
- `showEntrancePass`
- content editor field `hashtag` (legacy)

## Changes applied

1. Wired `showGiftSection` to runtime:
- hides `Regalo` from main nav when disabled
- blocks direct `/gift` route (renders NotFound)

2. Wired `showEntrancePass` to runtime:
- hides `Invito` from main nav when disabled
- blocks direct `/pass` route (renders NotFound)

3. Added runtime sync event on admin settings save:
- `saveAdminSettings` now dispatches `admin-settings-changed`
- `Layout` listens to `admin-settings-changed` + `storage` for live nav coherence

4. Removed dead admin content control:
- removed `hashtag` from `EditableContent` model/defaults
- removed `hashtag` field from Admin content mapping
- added content snapshot sanitization in `getContent()` to drop deprecated fields from localStorage

## Tests added

- `artifacts/wedding/src/lib/storage.admin-settings.test.ts`
  - settings persistence
  - legacy preset (`blush`) sanitization
  - deprecated content field cleanup (`hashtag`)

- `artifacts/wedding/src/App.admin-visibility.test.tsx`
  - nav hides gift/pass links when disabled
  - direct `/gift` blocked when disabled
  - direct `/pass` blocked when disabled

## Validation

- `corepack pnpm run typecheck` ✅
- `corepack pnpm run lint` ✅
- `corepack pnpm --filter @workspace/wedding run build` ✅
- `corepack pnpm run test` ✅

Result: no fake visibility controls remain; admin toggles now match runtime behavior.

