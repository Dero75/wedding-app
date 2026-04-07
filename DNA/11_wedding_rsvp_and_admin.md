# 04 — RSVP and Admin

## RSVP flow

1. Guest opens `/rsvp`
2. Fills form: first name, last name, confirmed adults, people under 18, dietary quantities (Vegetariani/Celiaci)
3. On submit: saved to `wedding_rsvps` (all RSVPs) and `wedding_my_rsvp` (their entry)
4. Confirmation card shown with edit button
5. Guest can return and edit anytime
6. RSVP stays open (no deadline constraint in UI or logic)
7. Runtime model is confirm-only: no explicit decline branch

## RSVPEntry type

```typescript
interface RSVPEntry {
  id: string; // timestamp-based unique ID
  firstName: string;
  lastName: string;
  guestCount: number;
  childrenCount: number; // under 18
  dietaryCounts: { vegetarian: number; celiac: number };
  submittedAt: string; // ISO 8601
}
```

## localStorage keys

| Key                      | Content                                           |
| ------------------------ | ------------------------------------------------- |
| `wedding_rsvps`          | `RSVPEntry[]` — all RSVPs                         |
| `wedding_my_rsvp`        | `RSVPEntry \| null` — this guest's entry          |
| `wedding_content`        | `Partial<EditableContent>` — admin-edited content |
| `wedding_admin_settings` | Legacy key removed automatically at startup        |

## Admin panel (`/admin`)

Admin is split into:

- `/admin` → RSVP-focused home (stats + RSVP list)
- `/admin/settings` → content editor only

### Visibility controls

Removed from Admin and runtime.
All public sections/routes are always active.

### Content editor

Direct content editor grouped in separate white cards by frontend area:

- Home
- Benvenuto
- Bottoni Home
- Programma
- Regalo
- Invito / Pass
- Saves on every keystroke to localStorage
- Pages read from `getContent()` — changes reflect live
- `Nome sposa`/`Nome sposo` were removed from editable fields

### RSVP list

Always-visible scrollable list of RSVP cards:

- Shows only confirmations received
- Per-entry details: confirmed adults, people under 18 (if > 0), dietary quantities (only if > 0)
- No outer container header/toolbar

Admin home summary cards:

- `Confermati` = total confirmed adults (`sum(guestCount)`)

## EditableContent fields

```typescript
interface EditableContent {
  introTagline;
  heroSubtitle;
  weddingTime;
  weddingLocation;
  weddingAddress;
  welcomeTitle;
  welcomeText;
  ctaRSVP;
  ctaDetails;
  ceremonyPlace;
  ceremonyTime;
  ceremonyAddress;
  ceremonyNote;
  receptionPlace;
  receptionTime;
  receptionAddress;
  receptionNote;
  giftTitle;
  giftText;
  giftIBAN;
  giftBIC;
  giftHolder;
  passTitle;
  passSubtitle;
}
```

Note: event date and couple names are fixed at app level and not editable from Admin.

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

## Aggiornamento Enterprise (2026-04-08)

- Verificato e consolidato lo stato del runtime dopo le ultime modifiche chat.
- Allineamento local/deploy: il runtime usa sorgente DB-first in ambiente reale; fallback locale resta attivo solo in test.
- Eliminati i residui locali `wedding_*` non necessari in bootstrap DB per evitare divergenze local/deploy.
- Introdotto client Supabase dedicato (`src/lib/supabaseClient.ts`) e integrazione completa nel layer storage.
- Storage refactor enterprise senza modifiche di business logic:
  - `src/lib/storage.ts` ridotto a 240 righe.
  - Nuovi moduli: `storageTypes.ts`, `storageRsvpSanitizer.ts`, `storageMappers.ts`.
  - API pubblica invariata (`getContent`, `saveContent`, `getRSVPs`, `getMyRSVP`, `saveMyRSVP`, ecc.).
- Layout utente semplificato su richiesta:
  - menu a tendina rimosso dalla sezione user;
  - pulsante `Home` (senza contorno) posizionato al posto del menu toggle;
  - switch `USER/ADMIN` sempre visibile in tutte le pagine, inclusa Intro.
- RSVP aggiornato con modale post-conferma per download invito (PNG) e accesso rapido al pass digitale.
- Tipografia uniformata: solo `Cormorant Garamond` per heading/titoli e `Jost` per il resto.
- Home: testo di benvenuto impostato a `15px`.
- Test suite riallineata alle nuove regole runtime/UI (nessuna logica business alterata).
- Verifiche qualità complete eseguite con esito verde:
  - `typecheck` OK
  - `lint` OK
  - `test` OK (13/13)
  - `build` OK
- SQL/Supabase: in questo ciclo non sono stati introdotti cambi schema DB; quindi nessun nuovo script SQL necessario.
