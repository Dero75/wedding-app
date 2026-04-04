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
