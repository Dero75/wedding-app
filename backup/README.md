# Backup Locale (non committato)

Questa cartella contiene backup compressi del progetto creati manualmente su richiesta.

## Regola operativa

Quando l'utente scrive **"esegui nuovo backup"**, eseguire:

```bash
corepack pnpm run backup:new
```

## Formato file

- Nome base: `Backup_<giorno> <Mese>_<HH.MM>`
- Compressione: `tar.zst` (se `zstd` disponibile), altrimenti `tar.gz`
- Mai formato zip
- Nessuna sovrascrittura: in caso di collisione aggiunge suffisso `_01`, `_02`, ...

## Note Git

I file di backup in questa cartella sono ignorati da Git e non devono essere committati.

## Aggiornamento Operativo (2026-04-07)

- Policy backup confermata invariata.
- Eseguito nuovo ciclo operativo con backup incrementale non distruttivo richiesto a fine attivit  .

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
- Nuovo backup eseguito correttamente: `Backup_8 Aprile_00.26.tar.gz`.

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
- Nuovo backup eseguito correttamente: `Backup_8 Aprile_01.44.tar.gz`.

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

- Rieseguito audit tecnico completo (`typecheck`, `lint`, `test`, `build`, `deadcode`) con esito verde.
- Verificato e documentato il delta modifiche rispetto all'ultimo aggiornamento `.md` (2026-04-08).
- Allineata la documentazione informativa a tutte le modifiche runtime introdotte nel ciclo chat del 2026-04-09.
- Nuovo backup incrementale creato: `Backup_9 Aprile_00.04.tar.gz`.

## Aggiornamento Enterprise (2026-04-09 - hardening intro/home + clean pass)

- Rieseguito audit tecnico enterprise con risoluzione issue lint bloccante su hook React condizionali in `BackgroundMusicPlayer` (`App.tsx`), senza cambi di business logic.
- Consolidata la transizione mobile `Intro -> bianco -> Home` eliminando flicker pre-home e mantenendo UX canonica.
- Consolidata la regola audio: avvio musica solo al click `ENTRA`.
- Aggiornata e riallineata tutta la documentazione informativa (`DNA/*` + `REPORT_STATO_PROGETTO.md`) con il delta reale post-chat.
- Nuovo backup incrementale creato: `Backup_9 Aprile_14.09.tar.zst`.

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

## Aggiornamento Operativo (2026-04-09 - RSVP Google Sheet backup)

- Definita integrazione backup esterno RSVP con pipeline: Supabase trigger -> Apps Script webhook -> Google Sheet.
- Artefatti tecnici versionati in `scripts/google-sheet/` + report setup in `report/`.

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
- Nuovo backup incrementale creato: `Backup_9 Aprile_18.28.tar.zst`.
