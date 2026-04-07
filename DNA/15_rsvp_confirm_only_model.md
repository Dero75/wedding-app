# 15 — RSVP Confirm-Only Model (2026-04-04)

## Decision

Runtime RSVP model is now confirm-only:

- submitted response = confirmed presence
- no submitted response = not confirmed
- explicit decline branch removed from user/admin/pass runtime

## Runtime changes

- Removed `attending` from canonical `RSVPEntry`.
- Removed free text fields `dietaryNotes` and `message` from canonical `RSVPEntry`.
- Added structured `dietaryCounts` (`vegetarian`, `celiac`) with numeric quantities.
- Added `childrenCount` for guests under 18.
- RSVP form no longer asks yes/no attendance.
- RSVP page now bootstraps `my_rsvp` once at mount and edits via local state (no per-render storage read loop).
- Pass now depends only on existence of a valid confirmation (`my_rsvp`).
- Admin list and metrics no longer include decline/refusal paths.

## Legacy data sanitization

Handled centrally in `src/lib/storage.ts`:

- `getRSVPs()` drops legacy entries with `attending: false`.
- `getRSVPs()` sanitizes legacy RSVP payloads from `dietaryNotes`/`message` to `dietaryCounts`.
- `getMyRSVP()` clears legacy `my_rsvp` with `attending: false`.
- `getMyRSVP()` sanitizes legacy `my_rsvp` payloads to canonical `dietaryCounts`.
- sanitized snapshots are persisted back to localStorage.

## Admin alignment

- Admin home now exposes a single summary KPI:
  - confirmed adults
- RSVP list is confirmation-only.

## Tests

- Added `App.rsvp-pass.test.tsx` for:
  - confirm-only RSVP submit/edit flow
  - pass availability based on confirmation existence
- Extended `storage.admin-settings.test.ts` with legacy RSVP sanitization checks.

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
