# 01     Project Overview

## What this is

A mobile-first digital wedding invitation and RSVP web app for **Deborah & Davide** (Italian, fixed event date: **Venerdi 11 Settembre 2026**, Villa Borgonuovo, Bologna). Runs in any smartphone browser. No app installation required, no backend.

## Stack

| Layer       | Technology                                              |
| ----------- | ------------------------------------------------------- |
| Framework   | React 19 + Vite + TypeScript                            |
| Routing     | Wouter                                                  |
| Styling     | Tailwind CSS v4 + tw-animate-css                        |
| Forms       | react-hook-form + zod                                   |
| Icons       | lucide-react                                            |
| Persistence | localStorage                                            |
| Fonts       | Cormorant Garamond (serif) + Jost (sans)     Google Fonts |

## Language

All user-facing text is in Italian.

## Architecture principles

1. **Single data layer**     all persistence lives in `src/lib/storage.ts`. No page component ever accesses `localStorage` directly.
2. **EditableContent** is the authoritative source for user-facing text except event date, which is fixed in `src/config/event.ts`. All pages call `getContent()` for editable copy.
3. **AdminSettings** controls only editable text/content.
4. **Single visual theme**     the app uses one canonical `Avorio Classico` theme; no runtime preset switching.
5. **Admin direct access**     `/admin` is directly available (no PIN gate).
6. **RSVP model**     confirm-only with structured fields (`firstName`, `lastName`, `guestCount`, `childrenCount`, `dietaryCounts`).
7. **Supabase-ready**     swap the implementations in `storage.ts`. Zero page changes needed.

## Folder structure

```
artifacts/wedding-app/
  src/
    App.tsx               # Router + startup sanitizers
    index.css             # Canonical Avorio CSS variables + Google Fonts import
    pages/                # Page components (+ /admin and /admin/settings)
    components/           # Layout, WeddingButton, WeddingCard, Toggle, etc.
    lib/
      storage.ts          # ALL persistence: EditableContent, RSVP (+ legacy cleanup helpers)
    config/
      event.ts            # Fixed event constants (date/city labels)
    pages/admin/          # Admin page submodules
    pages/rsvp/           # RSVP page submodules
    components/ui/        # Canonical runtime UI set: toast, toaster, tooltip
DNA/                      # Technical documentation (repository root)
attached_assets/          # Venue photos
```

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
- Home ottimizzata: data fissa `Venerdi 11 Settembre 2026`, nome coppia e citt   centrati con interspazi ridotti; separatore senza icona cuore.
- Dettagli (`Cerimonia`/`Ricevimento`) compattati ~20% mantenendo stile/layout canonico.
- Header admin consolidato: `Home` a sinistra, switch USER/ADMIN centrato, hamburger assente in `/admin*`.
- Stabilit   dev server migliorata: avvio detached affidabile in `scripts/wedding-app-dev-server.sh` per evitare stop intermittenti su `5001`.
- Nessuna modifica di business logic; solo consolidamento tecnico e coerenza runtime/documentazione.

## Aggiornamento Enterprise Finale (2026-04-07)

- Eseguito hardening completo runtime con qualit   verde (`typecheck`, `lint`, `test`, `build`, `deadcode`).
- Confermata assenza di file funzionali oltre soglia 350 righe.
- Deploy Cloudflare Pages validato (build monorepo `@wedding-app/wedding-app`, output `artifacts/wedding-app/dist/public`).
- Variabili Supabase aggiornate ai nuovi valori progetto (`hbmccalscnescpvomrjo`).
- Intro aggiornata: rimossi i testi "il matrimonio di" e "tocca per entrare"; durata auto a 4.5s.
- Header home aggiornato: pulsante/label `Home` non mostrato su route `/home`.
- Switch `USER/ADMIN` reso visibile anche in deploy (non solo DEV) su `/home` e `/admin*`.
- Home aggiornata senza cambiare business logic: pulsanti CTA ridotti al 70% larghezza; blocco testi principale aumentato del 25%; data/citt   uniformate a 10px.
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
- Verifiche qualit   complete eseguite con esito verde:
  - `typecheck` OK
  - `lint` OK
  - `test` OK (13/13)
  - `build` OK
- SQL/Supabase: in questo ciclo non sono stati introdotti cambi schema DB; quindi nessun nuovo script SQL necessario.

## Aggiornamento Enterprise Finale (2026-04-08     ciclo finale realtime + RSVP)

- Audit completo rieseguito con qualit   verde: `lint`, `typecheck`, `test`, `build` OK.
- Verificata soglia file funzionali: nessun file oltre 350 righe (`RSVP.tsx` 321, `storage.ts` 310).
- Abilitata sincronizzazione realtime in Admin (`Gestione Invitati`) via subscription Supabase su `public.rsvps`.
- Corretto errore TypeScript nel cleanup channel realtime (`supabase` nullable guard).
- RSVP esteso a doppio esito mantenendo UX coerente:
  - conferma presenza con modale di conferma pre-invio,
  - non partecipazione con flusso dedicato (solo nome/cognome),
  - nome/cognome normalizzati con iniziali maiuscole anche per composti.
- Admin RSVP allineato al nuovo stato:
  - evidenza visiva rossa per `Non partecipa`,
  - doppia conferma modale prima dell'eliminazione,
  - filtri smart tra riepilogo e cards (`A-Z/Z-A`, `Tutti/Confermati/Eliminati`),
  - pulsante elimina ridotto a sola icona cestino rossa senza bordo/testo.
- Riepilogo Admin aggiornato a cinque box in una sola riga (`Adulti`, `Minorenni`, `Vegetariani`, `Celiaci`, `Assenti`) senza icone; `Assenti`   in ultima posizione a destra con colore rosso naturale.
- Intro aggiornata: switch `USER/ADMIN` non visualizzato nella schermata intro.
- Invito scaricato da RSVP allineato alla intro in versione standard generica:
  - nessun nominativo ospite,
  - testo finale: `Invito da presentare a Palazzo Isolani.`
- Admin Settings pulito:
  - rimosso box `Invito / Pass`,
  - rimosso campo `BIC / SWIFT`,
  - rimosso campo `Testo` della sezione regalo non presente nel runtime utente.
- IBAN aggiornato a formato compatto senza spazi (migliore copia/incolla bonifico) con normalizzazione centralizzata.
- Deadcode scan rieseguito: restano solo export non critici fuori flusso runtime principale.
- SQL necessario introdotto in questo ciclo:
  - `ALTER TABLE public.rsvps ADD COLUMN attending boolean not null default true;`
  - `ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvps;`

## Aggiornamento Incrementale (2026-04-08 - fine tuning UI admin/programma)

- Admin `Gestione Invitati`: riepilogo ora a 5 box in una riga (`Adulti`, `Minorenni`, `Vegetariani`, `Celiaci`, `Assenti`), con `Assenti` in ultima posizione a destra (rosso naturale).
- Etichette riepilogo aggiornate: `Under 18` -> `Minorenni`, `Non confermati` -> `Assenti`.
- Pagina `Il Programma`: titolo blocco regalo (`Il regalo piu bello sara condividere con voi questo giorno.`) allineato a colore e dimensione dei titoli `Cerimonia`/`Ricevimento`.
- SQL/Supabase: nessuna nuova modifica schema richiesta in questo incremento.

## Aggiornamento Incrementale (2026-04-08 - enterprise refresh finale)

- Audit tecnico completo eseguito con esito verde: `lint`, `typecheck`, `test`, `build` OK.
- Confermata soglia file funzionali <= 350 righe (max runtime: `RSVP.tsx` 344 righe).
- Admin topbar: aggiunto pulsante refresh adesioni accanto alle impostazioni con reload reale tabella RSVP (`refreshRsvpsFromDb`).
- Admin KPI: riepilogo consolidato a 5 box (`Adulti`, `Minorenni`, `Vegetariani`, `Celiaci`, `Assenti`) sulla stessa riga.
- Admin filtri: voce stato aggiornata da `Eliminati` a `Assenti`.
- Admin lista invitati: naming minori uniformato globalmente a `minorenne/minorenni`.
- Admin stile controlli: ingranaggio e icona refresh allineati al marrone UI; bordo refresh invariato e sottile.
- Programma/Regalo: titolo regalo allineato a colore/dimensione dei titoli sezione Programma.
- RSVP conferma: rimosso container di riepilogo e icona conferma; mantenuto solo pulsante con contorno.
- RSVP copy conferma aggiornato: "Con gioia confermiamo la registrazione per X persone (totale adulti+minorenni)".
- RSVP form: titolo/divider `Conferma la tua presenza` nascosti nella fase form; pulsante assenza aggiornato in `Conferma la tua assenza`.
- Invito scaricato: rendering canvas riallineato alla Intro (proporzioni linee/testi/font), e chiusura automatica modale su click `SCARICA INVITO`.
- Regole dati RSVP rafforzate senza cambiare business logic:
  - obbligo almeno 1 adulto per conferma;
  - vincolo `vegetariani + celiaci <= adulti + minorenni` su validazione form + controllo difensivo pre-save;
  - sanitizzazione storage per normalizzare eventuali record legacy non conformi.
- Qualita runtime confermata: nessun blocco, nessun conflitto, nessuna regressione sui test core.
- SQL/Supabase: nessuna nuova modifica schema necessaria in questo ciclo.

## Aggiornamento Enterprise (2026-04-09 - consolidamento post-chat)

- Rieseguito audit tecnico completo con approccio enterprise su runtime e workspace (senza alterare business logic).
- Quality gates confermati verdi sullo stato corrente: `typecheck`, `lint`, `test`, `build`, `deadcode`.
- Verificata assenza di file funzionali oltre soglia 350 righe.
- Verificato il delta rispetto all'ultimo aggiornamento documentale (2026-04-08) e allineato il runtime alle modifiche richieste in chat.
- Programma (`Details`) aggiornato mantenendo layout/UX canonici:
  - aggiunto box `Outfit consigliato` in stile coerente con le card esistenti;
  - introdotta palette visuale a 3 quadrati (bianco, beige, bordeaux) senza etichette testuali;
  - testo outfit aggiornato e gestito con font titolo (no corsivo) con dimensionamento finale richiesto;
  - rimosso `Apri mappa` nella sezione `Cerimonia` (mantenuto su `Ricevimento`);
  - `Cerimonia` / `Ricevimento` e testi indirizzo riallineati a tipografia titolo; indirizzi portati a dimensione finale `14px`;
  - rimosso corsivo dalle note `ceremonyNote`/`receptionNote`.
- Admin contenuti esteso con gestione esplicita del box outfit:
  - nuovi campi `outfitTitle` e `outfitText` in `EditableContent` e `Admin Settings`.
- Persistenza contenuti consolidata senza cambio logica business:
  - mapping storage aggiornato per i nuovi campi outfit;
  - in modalità DB-first i campi outfit vengono conservati tramite override locale dedicato, evitando regressioni con schema DB invariato.
- Admin RSVP consolidato nelle iterazioni precedenti del ciclo chat e mantenuto stabile in questo pass:
  - naming `under` uniformato;
  - KPI con label ridotte e allineate;
  - badge dieta in linea con riga stato tramite icone + valore;
  - icona cestino centrata verticalmente a destra nella card.


## Aggiornamento Enterprise (2026-04-09 - hardening intro/home + clean pass)

- Eseguito audit tecnico completo post-chat con approccio conservativo: nessuna modifica a business logic, UX canonica invariata.
- Stabilita' runtime consolidata su transizione intro/home:
  - musica background avviata solo al click su `ENTRA` (niente autoplay anticipato);
  - pipeline fade mobile resa continua `Intro -> bianco -> Home` con eliminazione del frame di flicker pre-home;
  - transizione bianca in ingresso Home resa pre-paint-safe tramite inizializzazione stato da `sessionStorage` al primo render.
- Intro UI allineata alle ultime richieste chat:
  - pulsante `ENTRA` mantenuto in basso (`82vh` / `82dvh`);
  - hint discreto `Audio on` aggiunto e rifinito (tracking/font ridotti);
  - effetto di scomparsa del pulsante ripristinato alla versione baseline richiesta.
- Hardening codice applicativo:
  - corretto `BackgroundMusicPlayer` in `App.tsx` per rispetto regole hook React (eliminata chiamata condizionale hook che causava errore lint);
  - effetti audio invariati lato comportamento funzionale.
- Verifiche enterprise eseguite e verdi:
  - `corepack pnpm run lint` -> OK
  - `corepack pnpm run typecheck` -> OK
  - `corepack pnpm run test` -> OK (22/22)
  - `corepack pnpm run build` -> OK
  - `corepack pnpm run deadcode` -> solo export residui non bloccanti (nessun errore runtime)
- Soglia modularita' verificata: nessun file funzionale runtime wedding oltre 350 righe; nessuna modularizzazione aggiuntiva necessaria in questo pass.
- File obsoleti: nessun file versionato da eliminare in sicurezza nel ciclo corrente.
