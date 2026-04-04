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
