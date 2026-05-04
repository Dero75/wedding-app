# Policy Backup Locale

## Obiettivo

Rendere la creazione backup ripetibile in ogni ambiente (nuova chat, altro computer, clone repo) con una regola unica nel repository.

## Trigger operativo

Quando viene richiesto **"esegui nuovo backup"**, eseguire:

```bash
corepack pnpm run backup:new
```

## Regole implementate

- Cartella backup canonica: `./backup`
- Nome file: `Backup_<giorno> <Mese>_<HH.MM>`
- Formato compresso: `tar.zst` (preferito) oppure `tar.gz` (fallback)
- Formato zip non usato
- Nessuna sovrascrittura: se esiste gi  , aggiunge suffisso `_01`, `_02`, ...
- Esclusi dal pacchetto: `.git`, `backup`, `node_modules`, `.local`, `.agents`, `coverage`, `dist`

## Regola Git

I file archivio sotto `backup/` sono ignorati da Git tramite `.gitignore`.
`backup/README.md` resta versionato per mantenere la procedura nel progetto.

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
- Nuovo backup incrementale creato: `Backup_8 Aprile_01.58.tar.gz`.

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
- Nuovo backup incrementale creato: `Backup_8 Aprile_02.27.tar.gz`.

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

## Aggiornamento Enterprise (2026-04-09 - stabilizzazione sync Google Sheet)

- Audit completo rieseguito con quality gate verdi: `lint`, `typecheck`, `test`, `build`.
- Integrazione RSVP backup allineata al comportamento reale validato in produzione:
  - endpoint Apps Script `/exec` confermato operativo,
  - trigger Supabase con timeout esplicito `20000ms`,
  - backfill con timeout `60000ms` + throttling `pg_sleep(1.5)` per evitare timeout massivi.
- Hardening Apps Script applicato per robustezza dati:
  - upsert sulla prima riga `id` libera (evita scrittura in coda a migliaia di righe),
  - compattazione righe sparse durante setup.
- Nessuna modifica a business logic, funzioni core runtime o UX visuale dell'app.

## Aggiornamento Operativo (2026-04-10 - RSVP Google Sheet CRUD)

- Integrazione Google Sheet consolidata in modalita CRUD: `INSERT`, `UPDATE`, `DELETE`.
- Trigger Supabase aggiornato a `AFTER INSERT OR UPDATE OR DELETE`.
- Apps Script unificato su `scripts/google-sheet/wedding_rsvp_backup_core.gs` con lock concorrenza in `doPost`.
- Backfill stabilizzato con timeout esteso + throttling (`pg_sleep(1.5)`).
- Nota operativa confermata: `TRUNCATE` non propaga delete row-level; usare `DELETE FROM public.rsvps` per svuotamento con sync verso foglio.

## Aggiornamento Operativo (2026-05-03)

- Procedura backup invariata e rieseguita con comando canonico:
  - `corepack pnpm run backup:new`
- Backup incrementale creato in `backup/` con naming policy ufficiale (giorno/mese/ora, senza sovrascritture).

## Aggiornamento Operativo (2026-05-03 - audit enterprise)

- A valle dell'audit enterprise completo, eseguito nuovo backup incrementale con procedura canonica.
- Convenzioni backup e policy di retention locale mantenute invariate.

## Aggiornamento Operativo (2026-05-04)

- A valle dell'hardening finale, eseguito nuovo backup incrementale con comando canonico:
  - `corepack pnpm run backup:new`
- Backup precedenti mantenuti, nessuna sovrascrittura.

## Aggiornamento Enterprise (2026-05-04 - riallineamento runtime admin, notifiche e backup)

- Eseguito riallineamento documentale completo dello stato corrente del progetto dopo le ultime modifiche runtime.
- Admin `Gestione Invitati` esteso con modifica RSVP da card: click su card apre modale coerente con UI esistente per aggiornare nome, cognome, stato confermato/assente, adulti, under, vegetariani e celiaci.
- Introdotta funzione storage dedicata `updateRSVP()` per aggiornare RSVP admin senza sovrascrivere `my_rsvp` dell utente corrente.
- Accesso admin dalla home utente riallineato: pulsante invisibile centrato nella topbar bianca, modale PIN con codice `2015`, persistenza sessione via `sessionStorage` fino a chiusura app/browser.
- Modale PIN reso mobile touch friendly con tastierino numerico 3x4, pulsante cancella e invio dedicato.
- In area admin resta visibile il pulsante centrale `User` per rientrare nella sezione pubblica.
- Pagina Programma aggiornata con ultimo swatch palette outfit in verde salvia naturale leggermente scuro (`#96aa86`).
- Campanella notifiche admin corretta in modo persistente per browser e PWA mobile: rimossa auto-marcatura iniziale come letto, introdotta chiave `wedding_admin_rsvp_seen_ids_v2`, conteggio calcolato da RSVP non viste e sync tra tab tramite `storage` event.
- Backup RSVP confermato come pipeline esterna operativa: `public.rsvps` Supabase resta source of truth, Google Sheet `RSVP_BACKUP` resta mirror CRUD via trigger `INSERT/UPDATE/DELETE` e Apps Script.
- Restore RSVP da backup Google Sheet analizzato: oggi e possibile ripristinare manualmente via export CSV + staging table + upsert su `public.rsvps`; non esiste ancora script one-click versionato, consigliato come prossimo hardening operativo.
- Verifiche runtime eseguite durante il ciclo: `lint`, `typecheck`, test mirati e suite test completa verdi; suite corrente a 26 test passati.
- Dev server locale confermato attivo su `http://localhost:5001`.
- Nuovo backup locale creato con procedura canonica: `backup/Backup_4 Maggio_20.42.tar.gz` (14.268.080 byte).

## Backup Locale (2026-05-04 - pre-deploy)

- Creato nuovo backup locale prima del commit/push deploy.
- Archivio: `backup/Backup_4 Maggio_21.13.tar.gz`.
- Dimensione: `14.281.192` byte.
- Il file rimane locale e non va versionato.

## Backup Finale (2026-05-04 - chiusura progetto)

- Creato backup locale finale prima del commit/push conclusivo.
- Archivio: `backup/Backup_4 Maggio_21.47.tar.gz`.
- Dimensione: `12.894.822` byte.
- Il file resta locale e non va versionato.

## Backup Finale (2026-05-04 - post quality gates)

- Creato backup locale dopo fix typecheck e gate enterprise conclusivi.
- Archivio: `backup/Backup_4 Maggio_21.52.tar.gz`.
- Dimensione: `12.895.299` byte.
- Il file resta locale e non va versionato.
