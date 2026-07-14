# Decision Log

Registro sintetico delle decisioni tecniche rilevanti. Voce piu recente in alto.
Solo decisioni con impatto duraturo (sicurezza, architettura, dati, convenzioni), non ogni fix.

## 2026-07-14

- **RLS su Supabase (Opzione A1)**: attivate policy per ruolo `anon` su `rsvps` (select/insert/update/delete) e `wedding_content` (select/update; insert/delete pubblici chiusi). Il delete su `rsvps` resta aperto ad `anon` perche il pannello admin usa la stessa chiave; accesso protetto solo da link + PIN. Alternativa scartata: chiudere il delete e spostarlo su service_role nel client (vietato: esporrebbe la chiave potente nel bundle). Miglioramento aperto: login admin reale che restringa il delete.
- **PIN admin da env**: `Layout.tsx` legge `VITE_ADMIN_PIN` (fallback al valore storico). Va impostato anche nelle env di build su Cloudflare Pages (fatto in produzione). Resta non-segreto per natura (app solo-frontend), ma fuori dal codice versionato.
- **Notifiche campanella admin**: passate da lista di id visti a un singolo timestamp "visto fino a" (`localStorage: wedding_admin_rsvp_last_seen_at`). Risolve badge fantasma al primo accesso e reset parziale da race col caricamento dati. Limite noto: non ancora condiviso tra dispositivi (per il cross-device servirebbe persistere il timestamp sul DB).
- **Ordinamento lista RSVP**: default per data conferma decrescente (piu recente prima); AZ/ZA su richiesta; il refresh torna al default.
- **`@tanstack/react-query` rimosso dal runtime `wedding-app`**: era dipendenza morta (Provider presente ma nessun `useQuery`/`useMutation`). Il data-layer resta la cache sincrona in `storage.ts`. La libreria resta nel catalog solo per lo scaffold `lib/api-client-react` (non usato in produzione).
- **`SUPABASE_DB_URL` corretta**: la connessione diretta puntava a un progetto sbagliato; riallineata al progetto reale `hbmccalscnescpvomrjo` in `.env` e App Control.
