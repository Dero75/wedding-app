# 02 — Pages and Navigation

## Routes

| Route      | Page         | Description                                                                                                       |
| ---------- | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| `/`        | Intro        | Fullscreen splash. Auto-advances after ~3.8s or on tap. Reads `getContent()` for names/date.                      |
| `/home`    | Home         | Hero + welcome + CTA. Always visible (no admin visibility toggles).                                             |
| `/rsvp`    | RSVP         | Form confirm-only (nome, cognome, adulti confermati, persone <18, esigenze alimentari con quantità). Confirmation card with edit. |
| `/details` | Details      | Day timeline + ceremony/reception cards with venue photos. Reads `getContent()` for place/time/notes.             |
| `/gift`    | Gift         | IBAN display with copy-to-clipboard. Reads `getContent()` for gift text and IBAN. Always reachable. |
| `/pass`    | EntrancePass | Premium dark pass card. Available only when a valid RSVP confirmation exists. Route always reachable. |
| `/admin`   | Admin        | Admin home focused on RSVP stats/list.                                                                              |
| `/admin/settings` | AdminSettings | Editor testi/contenuti.                                                                        |

## Navigation (Layout.tsx)

- Fixed top header: home label + hamburger icon on public routes
- In area admin (`/admin*`) hamburger hidden; on `/admin` top-right button is settings shortcut
- DEV only: compact `USER/ADMIN` switch can replace the header home label on `/home` and `/admin`
- Slide-in right drawer (300px, duration-300 ease-in-out)
- Active link: `text-accent` (coerente col tema canonico)
- Overlay backdrop closes drawer on tap
- `Regalo` e `Invito` sono sempre presenti nel menu principale
- Admin link at drawer bottom (small, muted — not prominent)

## Flow

```
/ (Intro) ──auto/tap──▶ /home ──▶ /rsvp
                              ──▶ /details
                              ──▶ /gift
                              ──▶ /pass  (locked if no RSVP)
                              ──▶ /admin
```

## Mobile-first notes

- `max-w-lg mx-auto` on all PageContainers
- All buttons: `rounded-full`, min 44px touch target, `active:scale-[0.97]`
- `-webkit-tap-highlight-color: transparent` on html
- Forms: `inputMode` hints on form fields
- RSVP confirm-only form (no explicit decline option in UI)
- RSVP includes dedicated selector for people under 18 (`childrenCount`)

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
