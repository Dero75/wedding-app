# REPORT_STATO_PROGETTO

Data analisi: 2026-04-04
Repository: `/Users/dero/Documents/wedding-app`

## 1. Stato generale del progetto

Il progetto    attualmente stabile lato toolchain: installazione, typecheck, lint, build e test passano tutti nello stato corrente.

Cosa funziona davvero oggi:
- App wedding React/Vite navigabile con routing funzionante (`/`, `/home`, `/rsvp`, `/details`, `/gift`, `/pass`, `/admin`, `/admin/settings`).
- Flusso RSVP funzionante con persistenza locale e modifica risposta.
- Pass digitale funzionante con stato bloccato/sbloccato in base a RSVP locale.
- Admin funzionante con riepilogo RSVP, lista RSVP e pagina separata impostazioni.
- Tema visivo unico canonico (`Avorio Classico`) applicato in runtime.

Cosa    incompleto:
- Nessun backend reale per RSVP/contenuti (tutto in localStorage, per-device).
- API server esiste ma espone solo healthcheck (`/api/healthz`) e non    integrato nel runtime wedding.
- Copertura test ancora parziale, ma i flussi critici toccati sono coperti (13 test attivi su RSVP/admin runtime/pass/storage).

Cosa    temporaneo:
- Switch `USER/ADMIN` in header visibile solo in DEV (`DevRoleSwitch`).
- `artifacts/mockup-sandbox`    un ambiente preview/scaffold separato dal runtime wedding, con ampia superficie non usata.

Cosa    incoerente o da rifinire:
- Parte della documentazione interna in `DNA/` va mantenuta allineata a ogni modifica (pattern gi   avviato, ma da proseguire in modo rigoroso).

## 2. Struttura reale del progetto

Il repository    un monorepo pnpm workspace.

Cartelle principali:
- `artifacts/wedding-app`: app frontend principale (runtime utente reale).
- `artifacts/api-server`: server Express 5.
- `artifacts/mockup-sandbox`: sandbox preview componenti.
- `lib/*`: librerie condivise (`api-client-react`, `api-zod`, `api-spec`, `db`).
- `scripts`: script operativi (backup, post-merge).
- `DNA`: report operativi globali.
- `backup`: archivi locali non versionati (tranne `README.md`).

Entrypoint reali:
- Frontend wedding: `artifacts/wedding-app/src/main.tsx` -> `App.tsx`.
- API server: `artifacts/api-server/src/index.ts` -> `app.ts`.
- Mockup sandbox: `artifacts/mockup-sandbox/src/main.tsx`.

Pagine reali wedding:
- `Intro`, `Home`, `RSVP`, `Details`, `Gift`, `EntrancePass`, `Admin`, `AdminSettings`, `NotFound`.

Componenti chiave:
- Layout e navigazione: `src/components/Layout.tsx`.
- Utility UI canoniche runtime: `src/components/ui/toast.tsx`, `toaster.tsx`, `tooltip.tsx`.
- Moduli admin: `src/pages/admin/components/*`.
- Moduli RSVP: `src/pages/rsvp/components/*` + `schema.ts`.

Shared logic importanti:
- Persistenza e modelli: `artifacts/wedding-app/src/lib/storage.ts`.
- Costanti evento fisso: `artifacts/wedding-app/src/config/event.ts`.

Configurazioni principali:
- Workspace/scripts: `package.json`, `pnpm-workspace.yaml`.
- TS strict base: `tsconfig.base.json`.
- Lint: `eslint.config.mjs`.
- Test: `vitest.config.ts`.
- Vite wedding: `artifacts/wedding-app/vite.config.ts` (porta default 5001).

## 3. Admin: stato reale

Home Admin (`/admin`) oggi contiene:
- Titolo pagina.
- `AdminStats` con KPI unico: adulti confermati.
- Lista RSVP card-based sempre visibile in area scrollabile interna (senza container/header dedicato).

Sezioni esistenti e separazione:
- Configurazioni app sono state separate in `/admin/settings`:
  - testi e contenuti (campi raggruppati in box separati per sezioni reali frontend).

Cosa    gi   separato:
- La home admin    focalizzata su RSVP/adesioni.
- La configurazione    in pagina dedicata.

Cosa    ancora mescolato:
- Nessuna protezione accesso admin (volutamente accesso diretto).

Problemi UX/strutturali rilevati:
- Non critici bloccanti nel runtime wedding; focus da mantenere su coerenza contenuti e copertura test.

## 4. Gestione contenuti

Dove sono salvati testi/config:
- `wedding_content` in localStorage (contenuti editabili).
- `wedding_admin_settings` rimosso a runtime come chiave legacy.
- Logica in `artifacts/wedding-app/src/lib/storage.ts`.

Contenuti modificabili oggi:
- Testi home, CTA, dettagli programma, testi regalo, testi pass.

Contenuti non modificabili oggi:
- Data/citt   evento e nomi sposi fissi in `src/config/event.ts`.

Criticit   architetturali:
- Salvataggio admin on-change a ogni input (semplice e reattivo, ma senza debounce/versioning).
- Nessun livello di validazione editoriale lato admin oltre ai tipi TS.

## 5. RSVP e logica utente

Stato reale del flusso RSVP:
- Form conferma-only con validazione zod (`firstName`, `lastName`, `guestCount`, `childrenCount`, `dietaryCounts`).
- Conferma post-invio con possibilit   di modifica.
- Header RSVP semplificato: solo titolo "Conferma la tua presenza" (kicker/testo extra rimossi).
- Nessuna opzione di rifiuto esplicito nel runtime.

Cosa viene salvato:
- Entry completa `RSVPEntry` in `wedding_rsvps`.
- Copia "utente corrente" in `wedding_my_rsvp`.

Come viene salvato:
- Solo localStorage, tramite funzioni canoniche in `storage.ts`.

Limiti attuali:
- Dati non condivisi tra dispositivi/browser.
- Nessuna deduplica server-side o controllo concorrenza.

Problemi di coerenza:
- Nessun blocco grave. Persistono limiti strutturali intrinseci della scelta localStorage-only.

## 6. Pass / accesso / schermate collegate

Stato reale pagina pass (`/pass`):
- Se `my_rsvp` assente: stato bloccato con CTA verso RSVP.
- Se esiste conferma valida: pass completo con dati ospite e dettagli evento.

Dipendenze da RSVP:
- Dipende interamente da `getMyRSVP()` locale.

Limiti/simplificazioni attuali:
- QR    placeholder visivo, non codice validabile.
- Accesso pass dipende solo dal dato locale del browser.

## 7. Qualit   tecnica

File troppo lunghi:
- Nessun file funzionale oltre 350 righe.
- `artifacts/wedding-app/src/lib/storage.ts`    stato ridotto a 349 righe.
- File pi   grande: `artifacts/wedding-app/src/index.css` (~498 righe), coerente con ruolo style-system.

Moduli troppo accoppiati:
- `storage.ts` centralizza molti domini (content, settings, rsvp): comodo ma da monitorare per crescita.

Dead code residuo:
- `knip`    stato configurato con `knip.json` per separare runtime wedding dal playground.
- Il segnale residuo    concentrato su pochi export non usati in utility runtime/shared libs.

Dipendenze dubbie/inutilizzate:
- Forte concentrazione nel package `@wedding-app/mockup-sandbox` (scaffold UI molto ampio non usato nel runtime wedding).

Punti fragili:
- Asset hero principale molto pesante (~2.54 MB nel build output), potenziale impatto su first load mobile.
- Coverage ancora parziale, anche se ora sono coperti i flussi RSVP/pass confirm-only e visibilit   admin essenziale.

## 8. Residui temporanei / sviluppo

Utility temporanee presenti:
- `artifacts/wedding-app/src/components/dev/DevRoleSwitch.tsx` (solo DEV).

Elementi da rimuovere/decidere a progetto finito:
- Dev switch USER/ADMIN.
- `artifacts/mockup-sandbox` (o va pulito e mantenuto come playground esplicito, o escluso meglio dalla governance qualit  ).
- `scripts/src/hello.ts`    placeholder tecnico.

Scorciatoie locali/hack:
- Nessun hack runtime critico trovato nel wedding app.
- Esiste remote aggiuntivo `gitsafe-backup` in git config locale (non impatta runtime applicativo).
-    presente script operativo dedicato per avvio locale stabile (`scripts/wedding-app-dev-server.sh` + script npm `app:*`).

## 9. Priorit   consigliate

1. Consolidare documentazione tecnica interna:
- Aggiornare `DNA/09_wedding_pages_and_navigation.md` e `DNA/11_wedding_rsvp_and_admin.md` rispetto all   attuale split `/admin` + `/admin/settings`.

2. Ridurre superficie morta del `mockup-sandbox`:
- Scegliere se tenerlo come playground con confini chiari (e config knip dedicata) o alleggerirlo drasticamente.

3. Rafforzare test sui flussi core:
- RSVP submit/edit, persistenza admin settings/content, condizione pass lock/unlock, sanitizzazione snapshot legacy.

4. Ottimizzare asset hero per mobile:
- Conversione/compressione immagine principale mantenendo resa visiva.

## 10. File da tenere d   occhio

- `artifacts/wedding-app/src/lib/storage.ts`
  -    il punto unico di persistenza; ogni evoluzione impatta tutto il runtime wedding.

- `artifacts/wedding-app/src/pages/Admin.tsx`
  - Deve restare focalizzato su adesioni, senza reintrodurre configurazioni duplicate.

- `artifacts/wedding-app/src/pages/AdminSettings.tsx`
  -    il contenitore canonico delle impostazioni app.

- `artifacts/wedding-app/src/pages/admin/constants.ts`
  - Contiene mapping campi contenuto admin; va mantenuto coerente col runtime.

- `artifacts/wedding-app/src/components/Layout.tsx`
  - Gestisce nav globale + switch DEV; punto sensibile per UX mobile e accessibilit  .

- `artifacts/wedding-app/src/pages/Home.tsx`
  - Ha vincoli di viewport per no-scroll iniziale e dipende da settings/content.

- `artifacts/wedding-app/src/pages/RSVP.tsx` e `src/pages/rsvp/components/*`
  - Flusso core utente, da proteggere con test di regressione.

- `artifacts/wedding-app/src/pages/EntrancePass.tsx`
  - Dipende direttamente dalla coerenza RSVP e dai contenuti evento.

- `artifacts/wedding-app/src/config/event.ts`
  - Fonte canonica della data fissa; ogni modifica qui impatta pi   schermate.

- `artifacts/mockup-sandbox/package.json`
  - Principale concentratore attuale di dipendenze/file non usati.

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
- Nuovo backup incrementale creato a fine ciclo: `Backup_8 Aprile_01.58.tar.gz`.

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
- Nuovo backup incrementale creato a fine ciclo: `Backup_8 Aprile_02.27.tar.gz`.

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

## Aggiornamento Enterprise (2026-04-09 - pwa install e stabilizzazione finale)

- Delta verificato rispetto all'ultimo aggiornamento documentale precedente: incluse tutte le modifiche introdotte nei commit `0d61a0c` e `8681475`.
- Home pubblica: ridotta la dimensione del testo data (`VENERDI 11 SETTEMBRE 2026`) con impatto solo tipografico, senza modifiche funzionali.
- Admin `/admin`: consolidato layout operativo con scroll confinato alla sola lista card adesioni; header/titolo/KPI/filtri restano fissi.
- Installazione app multipiattaforma implementata (PWA):
  - manifest pubblico (`manifest.webmanifest`),
  - service worker (`public/sw.js`) e registrazione runtime in `main.tsx`,
  - metadata iOS/Android/Desktop in `index.html`,
  - prompt installazione con fallback iOS in `InstallAppPrompt.tsx`.
- Nuova suite icone app integrata in `public/icons/` (SVG sorgente + PNG 192/512/1024 + apple-touch + favicon 32) basata su marchio `D&D` con palette intro.
- Pulizia enterprise aggiuntiva:
  - eliminata cartella temporanea locale `.tmp/` (anteprime non runtime),
  - ridotto rumore analisi deadcode aggiornando `knip.json` per ignorare il falso positivo su `public/sw.js` (asset statico referenziato via URL).
- Quality gates rieseguiti post-integrazione e confermati verdi:
  - `lint` OK
  - `typecheck` OK
  - `test` OK (22/22)
  - `build` OK
  - `deadcode` OK (restano solo export non bloccanti gia noti).
- Backup incrementale creato senza sovrascritture: `Backup_9 Aprile_14.36.tar.zst`.

## Aggiornamento Enterprise (2026-04-09 - consolidamento post-ultima chat)

- Rieseguito audit tecnico completo su workspace con quality gate tutti verdi: `typecheck`, `lint`, `test`, `build`, `deadcode`.
- Verificata soglia file funzionali <= 350 righe: nessun file runtime oltre limite (max `storage.ts` 310 righe).
- Pulizia obsoleti: rimosso asset non piu usato `attached_assets/Evento_serale_elegante_nel_cortile_storico_1775302758542.png`.
- Runtime/Admin allineato alle ultime richieste operative:
  - topbar admin: pulsante `Home` nascosto nella sola `Gestione Invitati` (resta nelle altre route admin),
  - route admin pubblica consolidata su `/admina` e `/admina/settings`,
  - ottimizzato spacing verticale sezione `Gestione Invitati` (titolo/KPI/cards),
  - cards RSVP: gap ridotto e label `Confermato` resa verde.
- RSVP form UX testuale aggiornata senza impatto business: pulsante `Non potro partecipare` con icona triste minimale.
- PWA install prompt disattivato/rimosso globalmente nel runtime (coerenza con richieste operative).
- Performance check confermato: colli di bottiglia residui noti su asset statici grandi (immagine hero e audio), senza modificare UX o business in questo ciclo.
- Nessuna modifica a logiche di business o flussi funzionali core.

## Aggiornamento Enterprise (2026-04-09 - sync RSVP -> Google Sheet)

- Integrazione backup operativo progettata e codificata con source of truth invariata su Supabase (`public.rsvps`).
- Pipeline scelta: trigger SQL Supabase (`INSERT/UPDATE`) -> webhook Apps Script -> upsert su foglio `RSVP_DB`.
- Aggiunti artefatti tecnici:
  - `scripts/google-sheet/wedding_rsvp_backup_core.gs`
  - `scripts/google-sheet/wedding_rsvp_backup_setup.gs`
  - `scripts/google-sheet/supabase_rsvp_google_sheet_sync.sql`
- Aggiunti report e setup operativo:
  - `report/REPORT_RSVP_GOOGLE_SHEET_BACKUP.md`
  - `report/SETUP_RSVP_GOOGLE_SHEET_BACKUP.md`
  - `scripts/google-sheet/README.md`
- Hardening Apps Script:
  - validazione token webhook,
  - parsing payload robusto (`record/rsvp/new`),
  - upsert deduplicato per `id`,
  - blocco righe fake vuote (`Non partecipa`/zeri su righe senza record),
  - dashboard KPI ricalcolata solo su record reali.
