# Guardrails

## Regole non negoziabili

- Il codice reale resta la fonte di verita primaria.
- `DNA/` e contesto operativo canonico, non sostituisce il codice.
- `DNA/STORICO/` e materiale secondario.
- Non creare documentazione duplicata con lo stesso scopo in root, `DNA/` e `report/`.

## Guardrail runtime

- Non reintrodurre la route `/admin` come se fosse canonica: la route reale e `/admina`.
- Non bypassare il layer `artifacts/wedding-app/src/lib/storage.ts` dai componenti senza una ragione forte e verificata.
- Non spostare i dati evento fissi in contenuti editabili senza richiesta esplicita.
- Non trattare il PIN admin client-side come misura di sicurezza reale; ora e letto da `VITE_ADMIN_PIN` (fallback al valore storico) e va impostato anche nelle env di build su Cloudflare Pages.
- Non assumere che l'API server gestisca RSVP o contenuti: oggi espone solo `healthz`.
- Non trattare `artifacts/mockup-sandbox` come sorgente autorevole del wedding runtime.

## Guardrail dati e integrazioni

- Supabase e la source of truth reale solo quando la config frontend e presente; verificare sempre il contesto di esecuzione.
- Google Sheet e backup mirror degli RSVP, non sorgente primaria del runtime.
- Per svuotamenti con sync verso Google Sheet, usare `DELETE`, non `TRUNCATE`.
- RLS attive su `rsvps` (select/insert/update/delete anon) e `wedding_content` (select/update anon; insert/delete pubblici chiusi). Il delete su `rsvps` e volutamente aperto alla chiave anon perche il pannello admin la usa: accesso protetto solo da link + PIN. Un vero login admin che restringa il delete resta un miglioramento aperto.

## Guardrail documentali

- Se un dettaglio e gia ovvio nel codice e non riduce rischio operativo, non aggiungerlo a `DNA/`.
- Se un documento invecchia facilmente, spostarlo nello storico invece di gonfiare il percorso canonico.
- Se codice e documentazione divergono, riallineare la documentazione al codice.
- Se cambia un flusso critico, aggiornare `DNA/` nello stesso ciclo di lavoro.

## Cose che meritano sempre un controllo extra

- intro: il blocco data/nomi/citta usa un asset statico per evitare bug di rendering font
  su Android/Honor; non tornare a testo webfont live senza test mirato sui device coinvolti;
- bootstrap dati e fallback locale/DB;
- route admin e meccanismo di accesso;
- validazione RSVP e shape dei dati salvati;
- realtime admin su Supabase;
- script SQL / Apps Script collegati al backup RSVP;
- comandi operativi root usati dall'utente.
