# REPORT_STATO_PROGETTO

Data analisi: 2026-04-04
Repository: `/Users/dero/Documents/Elegant-Event-Planner`

## 1. Stato generale del progetto

Il progetto è attualmente stabile lato toolchain: installazione, typecheck, lint, build e test passano tutti nello stato corrente.

Cosa funziona davvero oggi:
- App wedding React/Vite navigabile con routing funzionante (`/`, `/home`, `/rsvp`, `/details`, `/gift`, `/pass`, `/admin`, `/admin/settings`).
- Flusso RSVP funzionante con persistenza locale e modifica risposta.
- Pass digitale funzionante con stato bloccato/sbloccato in base a RSVP locale.
- Admin funzionante con riepilogo RSVP, lista RSVP e pagina separata impostazioni.
- Preset tema (`ivory`, `dark`) applicati in runtime.

Cosa è incompleto:
- Nessun backend reale per RSVP/contenuti (tutto in localStorage, per-device).
- API server esiste ma espone solo healthcheck (`/api/healthz`) e non è integrato nel runtime wedding.
- Copertura test molto bassa (1 test di routing intro).

Cosa è temporaneo:
- Switch `USER/ADMIN` in header visibile solo in DEV (`DevRoleSwitch`).
- `artifacts/mockup-sandbox` è un ambiente preview/scaffold separato dal runtime wedding, con ampia superficie non usata.

Cosa è incoerente o da rifinire:
- Toggle Admin `showGiftSection` e `showEntrancePass` esistono e si salvano, ma non governano realmente navigazione/route rendering delle relative pagine.
- Parte della documentazione interna in `DNA/` non è allineata allo stato codice attuale (es. admin ora separato in `/admin` + `/admin/settings`).

## 2. Struttura reale del progetto

Il repository è un monorepo pnpm workspace.

Cartelle principali:
- `artifacts/wedding`: app frontend principale (runtime utente reale).
- `artifacts/api-server`: server Express 5.
- `artifacts/mockup-sandbox`: sandbox preview componenti.
- `lib/*`: librerie condivise (`api-client-react`, `api-zod`, `api-spec`, `db`).
- `scripts`: script operativi (backup, post-merge).
- `DNA`: report operativi globali.
- `backup`: archivi locali non versionati (tranne `README.md`).

Entrypoint reali:
- Frontend wedding: `artifacts/wedding/src/main.tsx` -> `App.tsx`.
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
- Persistenza e modelli: `artifacts/wedding/src/lib/storage.ts`.
- Costanti evento fisso: `artifacts/wedding/src/config/event.ts`.

Configurazioni principali:
- Workspace/scripts: `package.json`, `pnpm-workspace.yaml`.
- TS strict base: `tsconfig.base.json`.
- Lint: `eslint.config.mjs`.
- Test: `vitest.config.ts`.
- Vite wedding: `artifacts/wedding/vite.config.ts` (porta default 5001).

## 3. Admin: stato reale

Home Admin (`/admin`) oggi contiene:
- Titolo pagina.
- `AdminStats` (risposte, presenti, ospiti).
- Card/pulsante `Impostazioni`.
- Sezione `Lista RSVP (N)` con refresh e delete.

Sezioni esistenti e separazione:
- Configurazioni app sono state separate in `/admin/settings`:
  - stile app,
  - visibilità sezioni,
  - testi e contenuti.

Cosa è già separato:
- La home admin è focalizzata su RSVP/adesioni.
- La configurazione è in pagina dedicata.

Cosa è ancora mescolato:
- Nessuna protezione accesso admin (volutamente accesso diretto).
- Alcuni toggle visibilità sono configurabili ma non pienamente applicati al comportamento runtime (vedi punto 4/7).

Problemi UX/strutturali rilevati:
- Non critici bloccanti; la principale incoerenza è funzionale (toggle non collegati), non visiva.

## 4. Gestione contenuti

Dove sono salvati testi/toggle/config:
- `wedding_content` in localStorage (contenuti editabili).
- `wedding_admin_settings` in localStorage (preset + toggle).
- Logica in `artifacts/wedding/src/lib/storage.ts`.

Contenuti modificabili oggi:
- Nomi sposi, testi home, CTA, dettagli programma, testi regalo, testi pass.
- Preset stile e toggle visibilità definiti in admin.

Contenuti non modificabili oggi:
- Data/città evento fisse in `src/config/event.ts` (`Venerdi 11 Setttembre - Bologna.`).

Criticità architetturali:
- Salvataggio admin on-change a ogni input (semplice e reattivo, ma senza debounce/versioning).
- Nessun livello di validazione editoriale lato admin oltre ai tipi TS.
- Toggle `showGiftSection` e `showEntrancePass` persistiti ma non realmente consumati in routing/nav/rendering pagine.

## 5. RSVP e logica utente

Stato reale del flusso RSVP:
- Form con validazione zod (`fullName`, `attending`, `guestCount`, campi opzionali).
- Conferma post-invio con possibilità di modifica.
- Testo corrente: "Le adesioni sono sempre aperte."

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
- Se `my_rsvp` assente o `attending=false`: stato bloccato con CTA verso RSVP.
- Se `attending=true`: pass completo con dati ospite e dettagli evento.

Dipendenze da RSVP:
- Dipende interamente da `getMyRSVP()` locale.

Limiti/simplificazioni attuali:
- QR è placeholder visivo, non codice validabile.
- Accesso pass dipende solo dal dato locale del browser.

## 7. Qualità tecnica

File troppo lunghi:
- Nessun file funzionale oltre 350 righe.
- File più grande: `artifacts/wedding/src/index.css` (~498 righe), coerente con ruolo style-system.

Moduli troppo accoppiati:
- `storage.ts` centralizza molti domini (content, settings, rsvp): comodo ma da monitorare per crescita.

Dead code residuo:
- `knip` rileva 59 file inutilizzati, quasi tutti in `artifacts/mockup-sandbox/src/components/ui/*`.
- Rilevate anche molte devDependency inutilizzate del solo `mockup-sandbox`.

Dipendenze dubbie/inutilizzate:
- Forte concentrazione nel package `@workspace/mockup-sandbox` (scaffold UI molto ampio non usato nel runtime wedding).

Punti fragili:
- Asset hero principale molto pesante (~2.54 MB nel build output), potenziale impatto su first load mobile.
- Suite test minimale (1 test), coverage reale bassa sui flussi critici.
- Incoerenza tra toggle admin disponibili e comportamento reale su gift/pass.

## 8. Residui temporanei / sviluppo

Utility temporanee presenti:
- `artifacts/wedding/src/components/dev/DevRoleSwitch.tsx` (solo DEV).

Elementi da rimuovere/decidere a progetto finito:
- Dev switch USER/ADMIN.
- `artifacts/mockup-sandbox` (o va pulito e mantenuto come playground esplicito, o escluso meglio dalla governance qualità).
- `scripts/src/hello.ts` è placeholder tecnico.

Scorciatoie locali/hack:
- Nessun hack runtime critico trovato nel wedding app.
- Esiste remote aggiuntivo `gitsafe-backup` in git config locale (non impatta runtime applicativo).

## 9. Priorità consigliate

1. Allineare i toggle admin al comportamento reale:
- O collegare `showGiftSection`/`showEntrancePass` a nav e rendering pagine, oppure rimuoverli dalla UI admin per evitare ambiguità.

2. Consolidare documentazione tecnica interna:
- Aggiornare `DNA/09_wedding_pages_and_navigation.md` e `DNA/11_wedding_rsvp_and_admin.md` rispetto all’attuale split `/admin` + `/admin/settings`.

3. Ridurre superficie morta del `mockup-sandbox`:
- Scegliere se tenerlo come playground con confini chiari (e config knip dedicata) o alleggerirlo drasticamente.

4. Rafforzare test sui flussi core:
- RSVP submit/edit, persistenza admin settings/content, condizione pass lock/unlock.

5. Ottimizzare asset hero per mobile:
- Conversione/compressione immagine principale mantenendo resa visiva.

## 10. File da tenere d’occhio

- `artifacts/wedding/src/lib/storage.ts`
  - È il punto unico di persistenza; ogni evoluzione impatta tutto il runtime wedding.

- `artifacts/wedding/src/pages/Admin.tsx`
  - Deve restare focalizzato su adesioni, senza reintrodurre configurazioni duplicate.

- `artifacts/wedding/src/pages/AdminSettings.tsx`
  - È il contenitore canonico delle impostazioni app.

- `artifacts/wedding/src/pages/admin/constants.ts`
  - Contiene mapping dei campi/toggle admin; qui si crea facilmente mismatch con il runtime.

- `artifacts/wedding/src/components/Layout.tsx`
  - Gestisce nav globale + switch DEV; punto sensibile per UX mobile e accessibilità.

- `artifacts/wedding/src/pages/Home.tsx`
  - Ha vincoli di viewport per no-scroll iniziale e dipende da settings/content.

- `artifacts/wedding/src/pages/RSVP.tsx` e `src/pages/rsvp/components/*`
  - Flusso core utente, da proteggere con test di regressione.

- `artifacts/wedding/src/pages/EntrancePass.tsx`
  - Dipende direttamente dalla coerenza RSVP e dai contenuti evento.

- `artifacts/wedding/src/config/event.ts`
  - Fonte canonica della data fissa; ogni modifica qui impatta più schermate.

- `artifacts/mockup-sandbox/package.json`
  - Principale concentratore attuale di dipendenze/file non usati.
