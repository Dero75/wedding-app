# Next-Step Priorities (Post-Phase-1 Baseline)

## Current strengths

- Workspace builds and typechecks end-to-end.
- Quality gates are installed and runnable (`typecheck`, `lint`, `build`, `test`, `deadcode`).
- Replit coupling removed from runtime/config path.
- Wedding app dev command is deterministic on local port 5001.
- `Admin` and `RSVP` pages are now split into smaller modules with unchanged behavior.
- Local-only dev switch `USER/ADMIN` is isolated and removable (`src/components/dev/DevRoleSwitch.tsx`).

## Open technical risks

- Large dead/scaffold area:
  - `knip` reports 113 unused files and many unused dependencies.
  - Most are in `components/ui/*` for wedding/mockup-sandbox.
- Oversized modules increase maintenance risk:
  - `ui/sidebar.tsx`, `custom-fetch.ts`.
- `format:check` currently fails because legacy codebase is not fully Prettier-aligned.

## Recommended priority order

1. Dead code reduction pass (safe, incremental): decide canonical UI surface and remove unused `components/ui/*` scaffold files in wedding/mockup-sandbox.
2. Harden dead-code governance:
   - add `knip.json` with explicit workspace entries/ignores, then switch `deadcode` to blocking mode.
3. Normalize formatting strategy:
   - either one-time repo-wide Prettier reformat, or scoped formatting policy with documented excludes.
4. Add more tests for critical flows:
   - `/rsvp` submission/edit path.
   - `/admin` settings/content persistence.
