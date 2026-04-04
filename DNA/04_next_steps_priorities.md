# Next-Step Priorities (Post-Phase-1 Baseline)

## Current strengths

- Workspace builds and typechecks end-to-end.
- Quality gates are installed and runnable (`typecheck`, `lint`, `build`, `test`, `deadcode`).
- Replit coupling removed from runtime/config path.
- Wedding app dev command is deterministic on local port 5001.
- `Admin` and `RSVP` pages are now split into smaller modules with unchanged behavior.
- Local-only dev switch `USER/ADMIN` is isolated and removable (`src/components/dev/DevRoleSwitch.tsx`).
- Supabase future-sync project coordinates are already staged in `artifacts/wedding/.env.example`.
- Dead-code governance now has explicit config (`knip.json`) scoped to runtime relevance.

## Open technical risks

- Remaining dead-code signal is now mostly export-level leftovers in shared utilities (`toast/tooltip/use-toast` and `lib/api-client-react`), after excluding non-runtime playground files.
- Oversized modules increase maintenance risk:
  - `lib/api-client-react/src/custom-fetch.ts` (still complex, though reduced below 350 lines).
- `format:check` currently fails because legacy codebase is not fully Prettier-aligned.

## Recommended priority order

1. Decide whether to keep `artifacts/mockup-sandbox` as long-term playground or archive/remove it in a dedicated change.
2. Tighten dead-code policy:
   - either remove or formally keep the remaining unused exports in runtime/shared libs.
3. Normalize formatting strategy:
   - either one-time repo-wide Prettier reformat, or scoped formatting policy with documented excludes.
4. Add more tests for critical flows:
   - `/rsvp` submission/edit path.
   - `/admin` settings/content persistence.

## Aggiornamento Allineamento Finale (2026-04-04)

- Verificata coerenza runtime/documentazione con stato codice corrente.
- Admin: in area `/admin*` hamburger nascosto; su `/admin` resta shortcut impostazioni.
- Admin home: KPI unico `Confermati`.
- Admin settings: editor contenuti in box bianchi separati per sezione frontend.
- RSVP: header ridotto al solo titolo; select `Minorenni` con label `minorenne/minorenni`.
- Tipografia canonica confermata: titoli serif, UI/testi sans.
- Nessuna nuova logica business introdotta in questo allineamento documentale.
