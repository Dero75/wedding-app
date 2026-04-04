# 14 — Admin Visibility + Theme Controls Removal (2026-04-04)

## Scope

Remove `Visibilità sezioni` and `Stile dell'app` from Admin settings and delete all related runtime toggles/theme switching.

## Changes applied

1. Removed Admin UI block:
- deleted `AdminVisibilitySection`
- removed visibility section from `AdminSettings`

2. Removed runtime visibility logic:
- Home no longer branches on welcome/photo visibility flags
- `/gift` and `/pass` routes are always mounted
- main navigation always shows `Regalo` and `Invito`

3. Removed related persistence model:
- `wedding_admin_settings` is now a legacy key, removed by startup sanitization
- no runtime/admin settings persistence remains for visibility or theme

4. Removed obsolete event coupling:
- deleted `admin-settings-changed` custom event path used for visibility sync

## Tests updated

- `App.admin-visibility.test.tsx`
  - now asserts runtime remains active even if legacy visibility flags exist in localStorage
- `storage.admin-settings.test.ts`
  - now asserts cleanup of legacy visibility fields from admin settings snapshot

## Result

No visibility toggle remains in Admin UI or runtime logic.
All sections and routes are canonical and always active.

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
- Stabilità dev server migliorata: avvio detached affidabile in `scripts/wedding-dev-server.sh` per evitare stop intermittenti su `5001`.
- Nessuna modifica di business logic; solo consolidamento tecnico e coerenza runtime/documentazione.
