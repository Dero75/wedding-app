# 06 — Style System

## Typography

| Role                           | Font               | Weight  |
| ------------------------------ | ------------------ | ------- |
| Headings, couple names, titles | Cormorant Garamond | 300–600 |
| Body text, labels, UI          | Jost               | 300–500 |
| IBAN, monospace                | system mono        | —       |

Loaded via Google Fonts in `index.css` (first import before Tailwind).

## Canonical theme

The app now uses one fixed visual theme: **Avorio Classico**.

- No runtime preset switching
- No `data-preset` branching on `<html>`
- No admin UI to change theme

All visual tokens are defined once in `:root` inside `index.css`.

## Semantic tokens (Tailwind)

Shared components (`WeddingButton`, `WeddingCard`, `Layout`, `SectionTitle`, `Toggle`) use semantic classes (`bg-primary`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-accent`, etc.) with the canonical token set.

## Decorator tokens

`--p-*` tokens are retained for visual elements that require inline styles (hero overlays, pass gradients, intro backgrounds), but they belong to the single canonical theme.

## Spacing and radius

- Base radius: `0.75rem` (12px)
- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-full`
- Inputs: `rounded-xl`

## Motion

- `animate-in fade-in slide-in-from-bottom-4 duration-500` — confirmation states
- CSS opacity/transform — Intro splash
- `active:scale-[0.97]` — touch targets
- Toggle knob: `transition-transform duration-200`

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

## Aggiornamento Enterprise Finale (2026-04-07)

- Eseguito hardening completo runtime con qualità verde (`typecheck`, `lint`, `test`, `build`, `deadcode`).
- Confermata assenza di file funzionali oltre soglia 350 righe.
- Deploy Cloudflare Pages validato (build monorepo `@wedding-app/wedding-app`, output `artifacts/wedding-app/dist/public`).
- Variabili Supabase aggiornate ai nuovi valori progetto (`hbmccalscnescpvomrjo`).
- Intro aggiornata: rimossi i testi "il matrimonio di" e "tocca per entrare"; durata auto a 4.5s.
- Header home aggiornato: pulsante/label `Home` non mostrato su route `/home`.
- Switch `USER/ADMIN` reso visibile anche in deploy (non solo DEV) su `/home` e `/admin*`.
- Home aggiornata senza cambiare business logic: pulsanti CTA ridotti al 70% larghezza; blocco testi principale aumentato del 25%; data/città uniformate a 10px.
- Tipografia UI uniforme: tracking caratteri standardizzato a `tracking-wider` dove applicabile.
- Testi da Admin ora rispettano i ritorni a capo in rendering (`whitespace-pre-line`) mantenendo allineamenti correnti.
- Pagina Programma estesa con sezione contributo + modale IBAN (copia/intestatario) mantenendo coerenza visiva.
- Nessuna modifica alle logiche di business (RSVP confirm-only, pass gating, flussi admin).
