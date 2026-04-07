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
- Eseguito nuovo ciclo operativo con backup incrementale non distruttivo richiesto a fine attività.

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
- Nuovo backup eseguito correttamente: `Backup_8 Aprile_00.26.tar.gz`.
