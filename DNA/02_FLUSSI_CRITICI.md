# Flussi Critici

## Principio

Questi sono i flussi che un agent deve capire prima di intervenire sul runtime wedding.

## Bootstrap dati

File chiave: `artifacts/wedding-app/src/lib/storage.ts`

Comportamento reale:

- se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` sono presenti, il runtime usa Supabase come sorgente primaria;
- in test e nei casi senza config valida, il runtime usa localStorage come fallback;
- il bootstrap viene eseguito da `initializeWeddingDataSource()` in `App.tsx`.

Impatto:

- cambiare il layer storage senza capire il bootstrap rompe RSVP, contenuti, admin e pass.

## Intro -> Home

File chiave:

- `artifacts/wedding-app/src/pages/Intro.tsx`
- `artifacts/wedding-app/src/pages/Home.tsx`
- `artifacts/wedding-app/src/App.tsx`

Regole reali:

- `Intro` parte su `/` finche la sessione non la marca come completata;
- data, nomi e citta della intro sono renderizzati tramite asset statico
  `public/assets/intro-title-deborah-davide-v1.png` per evitare anomalie di rendering
  webfont su alcuni Android/Honor;
- `Entra` e indicazione audio restano elementi HTML reali e interattivi;
- la transizione usa `sessionStorage`;
- la musica parte solo da evento utente (`wedding:start-music`);
- la musica non deve suonare su route `/admina*`.

## RSVP utente

File chiave:

- `artifacts/wedding-app/src/pages/RSVP.tsx`
- `artifacts/wedding-app/src/pages/rsvp/schema.ts`
- `artifacts/wedding-app/src/lib/storage.ts`

Flusso reale:

- conferma presenza con validazione zod;
- possibile avviare il ramo di assenza da `/rsvp?decline=1`;
- submit confermato tramite modale prima del salvataggio;
- il record canonico usa:
  - `firstName`
  - `lastName`
  - `attending`
  - `guestCount`
  - `childrenCount`
  - `dietaryCounts`
  - `submittedAt`
- i nomi vengono normalizzati;
- `guestCount >= 1` per i confermati;
- `vegetarian + celiac <= guestCount + childrenCount`.

Nota:

- la documentazione storica sul modello "confirm-only" non e piu canonica; il codice attuale supporta sia conferma sia assenza esplicita.

## Pass digitale

File chiave: `artifacts/wedding-app/src/pages/EntrancePass.tsx`

Regola reale:

- il pass completo e visibile solo se `getMyRSVP()` restituisce un RSVP con `attending === true`;
- in assenza di conferma valida, la pagina mostra stato bloccato e CTA verso RSVP.

## Accesso admin

File chiave:

- `artifacts/wedding-app/src/components/Layout.tsx`
- `artifacts/wedding-app/src/pages/Admin.tsx`
- `artifacts/wedding-app/src/pages/AdminSettings.tsx`

Flusso reale:

- dalla home pubblica esiste un trigger invisibile centrato nella topbar;
- se la sessione non e gia sbloccata, si apre una modale PIN;
- il PIN e client-side e vive nel codice: non trattarlo come security boundary reale;
- lo sblocco admin persiste in `sessionStorage` fino a chiusura sessione browser/app;
- in area admin il pulsante centrale `User` riporta al runtime pubblico.

## Admin RSVP

File chiave:

- `artifacts/wedding-app/src/pages/Admin.tsx`
- `artifacts/wedding-app/src/pages/admin/components/*`
- `artifacts/wedding-app/src/lib/storage.ts`

Capacita reali:

- KPI adulti / minorenni / vegetariani / celiaci / assenti;
- ordinamento A-Z / Z-A;
- filtro `all` / `confirmed` / `declined`;
- modifica RSVP da modale;
- delete con doppia conferma;
- refresh manuale;
- realtime Supabase su `public.rsvps` se config presente;
- conteggio notifiche basato su ID visti in localStorage.

## Contenuti editabili

File chiave:

- `artifacts/wedding-app/src/pages/AdminSettings.tsx`
- `artifacts/wedding-app/src/pages/admin/components/AdminContentSection.tsx`
- `artifacts/wedding-app/src/lib/storage.ts`
- `artifacts/wedding-app/src/lib/storageTypes.ts`

Regole reali:

- i contenuti editabili sono salvati tramite `saveContent()`;
- il salvataggio e immediato, senza workflow editoriale separato;
- data, citta e nomi sposi restano invece fissi in `artifacts/wedding-app/src/config/event.ts`.
