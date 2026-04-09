# 05     Future Supabase Plan (Aggiornato 2026-04-07)

## Stato reale verificato dal codice

Analisi completa eseguita su runtime attuale:

- App principale: `artifacts/wedding-app`
- API server: `artifacts/api-server` (oggi solo `/api/healthz`)
- Persistenza runtime: **solo localStorage** via `src/lib/storage.ts`

Logiche oggi attive:

- RSVP confirm-only (`firstName`, `lastName`, `guestCount`, `childrenCount`, `dietaryCounts`)
- Admin diviso in:
  - `/admin` (stats + lista RSVP)
  - `/admin/settings` (editor contenuti)
- Pass (`/pass`) disponibile solo se `getMyRSVP()` esiste
- Contenuti editabili (`EditableContent`) salvati in `wedding_content`
- Sanitizzazione legacy gi   implementata in `storage.ts`

## Obiettivo migrazione Supabase

Portare su Supabase i dati condivisi tra dispositivi, mantenendo invariata UX:

- `wedding_rsvps` -> tabella `public.rsvps`
- `wedding_content` -> tabella `public.wedding_content`
- `wedding_my_rsvp` resta locale (identit   ospite device-based)

## Script SQL completi (Supabase SQL Editor)

Eseguire in ordine.

### 01) Estensioni + funzione trigger `updated_at`

```sql
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

### 02) Tabella RSVP

```sql
create table if not exists public.rsvps (
  id text primary key,
  first_name text not null check (char_length(trim(first_name)) >= 2),
  last_name text not null check (char_length(trim(last_name)) >= 2),
  guest_count integer not null check (guest_count between 1 and 10),
  children_count integer not null default 0 check (children_count between 0 and 10),
  dietary_counts jsonb not null default '{"vegetarian":0,"celiac":0}'::jsonb,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rsvps_dietary_counts_shape check (
    jsonb_typeof(dietary_counts) = 'object'
    and (dietary_counts ? 'vegetarian')
    and (dietary_counts ? 'celiac')
    and ((dietary_counts->>'vegetarian')::int between 0 and 10)
    and ((dietary_counts->>'celiac')::int between 0 and 10)
  )
);

drop trigger if exists trg_rsvps_set_updated_at on public.rsvps;
create trigger trg_rsvps_set_updated_at
before update on public.rsvps
for each row
execute function public.set_updated_at();

create index if not exists idx_rsvps_submitted_at on public.rsvps (submitted_at desc);
create index if not exists idx_rsvps_last_name on public.rsvps (lower(last_name), lower(first_name));
```

### 03) Tabella contenuti Admin (`EditableContent`)

```sql
create table if not exists public.wedding_content (
  id integer primary key check (id = 1),
  intro_tagline text not null,
  hero_subtitle text not null,
  wedding_time text not null,
  wedding_location text not null,
  wedding_address text not null,
  welcome_title text not null,
  welcome_text text not null,
  cta_rsvp text not null,
  cta_details text not null,
  ceremony_place text not null,
  ceremony_time text not null,
  ceremony_address text not null,
  ceremony_note text not null,
  reception_place text not null,
  reception_time text not null,
  reception_address text not null,
  reception_note text not null,
  gift_title text not null,
  gift_text text not null,
  gift_iban text not null,
  gift_bic text not null,
  gift_holder text not null,
  pass_title text not null,
  pass_subtitle text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_wedding_content_set_updated_at on public.wedding_content;
create trigger trg_wedding_content_set_updated_at
before update on public.wedding_content
for each row
execute function public.set_updated_at();
```

### 04) Seed contenuto iniziale (coerente con `DEFAULT_CONTENT`)

```sql
insert into public.wedding_content (
  id,
  intro_tagline,
  hero_subtitle,
  wedding_time,
  wedding_location,
  wedding_address,
  welcome_title,
  welcome_text,
  cta_rsvp,
  cta_details,
  ceremony_place,
  ceremony_time,
  ceremony_address,
  ceremony_note,
  reception_place,
  reception_time,
  reception_address,
  reception_note,
  gift_title,
  gift_text,
  gift_iban,
  gift_bic,
  gift_holder,
  pass_title,
  pass_subtitle
)
values (
  1,
  'il matrimonio di',
  'il matrimonio di',
  '16:00',
  'Villa Borgonuovo',
  'Via Borgonuovo 12, 40125 Bologna',
  'Siete i benvenuti',
  'Con immensa gioia vi invitiamo a celebrare con noi il giorno pi   bello della nostra vita. La vostra presenza render   questo momento ancora pi   indimenticabile.',
  'Conferma la tua presenza',
  'Il programma',
  'Villa Borgonuovo     Cappella',
  '16:00',
  'Via Borgonuovo 12, 40125 Bologna',
  'Vi chiediamo di arrivare 15 minuti prima della cerimonia.',
  'Villa Borgonuovo     Cortile interno',
  '18:30',
  'Via Borgonuovo 12, 40125 Bologna',
  'Ci uniamo nel cortile per il ricevimento all''aperto.',
  'Un pensiero per noi',
  'La vostra presenza    il regalo pi   bello che potessimo ricevere. Per chi volesse farci un pensiero, vi lasciamo i nostri riferimenti bancari.',
  'IT60 X054 2811 1010 0000 0123 456',
  'BLOPIT22',
  'Davide Rossi',
  'Il vostro invito',
  'Lasciate questo pass all''ingresso della villa'
)
on conflict (id) do nothing;
```

### 05) RLS/POLICY

Due profili possibili:

- **Profilo A (parit   runtime attuale)**: nessuna protezione reale, utile per partire subito.
- **Profilo B (consigliato produzione)**: usare API server con service role per letture admin e update contenuti.

#### Profilo A     parit   runtime locale

```sql
alter table public.rsvps enable row level security;
alter table public.wedding_content enable row level security;

drop policy if exists "rsvps_public_rw" on public.rsvps;
create policy "rsvps_public_rw"
on public.rsvps
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "content_public_rw" on public.wedding_content;
create policy "content_public_rw"
on public.wedding_content
for all
to anon, authenticated
using (true)
with check (true);
```

#### Profilo B     consigliato produzione

```sql
alter table public.rsvps enable row level security;
alter table public.wedding_content enable row level security;

revoke all on table public.rsvps from anon, authenticated;
revoke all on table public.wedding_content from anon, authenticated;

drop policy if exists "content_public_read" on public.wedding_content;
create policy "content_public_read"
on public.wedding_content
for select
to anon, authenticated
using (true);
```

In profilo B:

- insert/update RSVP e update contenuti vanno fatti da API server con **service role key**
- lato frontend anon mantenere solo letture pubbliche necessarie

## Mapping TypeScript -> DB

`RSVPEntry` -> `rsvps`:

- `firstName` -> `first_name`
- `lastName` -> `last_name`
- `guestCount` -> `guest_count`
- `childrenCount` -> `children_count`
- `dietaryCounts` -> `dietary_counts`
- `submittedAt` -> `submitted_at`

`EditableContent` -> `wedding_content` (snake_case equivalente)

## Note implementative per codice

Per migrazione reale:

1. creare `src/lib/supabaseClient.ts`
2. convertire `storage.ts` in async per `getRSVPs`, `saveMyRSVP`, `getContent`, `saveContent`
3. mantenere `my_rsvp` in localStorage
4. mantenere sanitizzazione legacy anche lato client prima delle write
5. se profilo B: aggiungere endpoint API server per admin read/list RSVP e update contenuti

## Variabili ambiente gi   presenti

- `VITE_SUPABASE_URL`: `https://hbmccalscnescpvomrjo.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: gi   presente in `artifacts/wedding-app/.env.example`

Stato attuale: Supabase non    ancora collegato al runtime, solo pianificato.

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
