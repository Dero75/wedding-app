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
- Nessuna sovrascrittura: se esiste già, aggiunge suffisso `_01`, `_02`, ...
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
- Home ottimizzata: data fissa `Venerdi 11 Settembre 2026`, nome coppia e città centrati con interspazi ridotti; separatore senza icona cuore.
- Dettagli (`Cerimonia`/`Ricevimento`) compattati ~20% mantenendo stile/layout canonico.
- Header admin consolidato: `Home` a sinistra, switch USER/ADMIN centrato, hamburger assente in `/admin*`.
- Stabilità dev server migliorata: avvio detached affidabile in `scripts/wedding-dev-server.sh` per evitare stop intermittenti su `5001`.
- Nessuna modifica di business logic; solo consolidamento tecnico e coerenza runtime/documentazione.
