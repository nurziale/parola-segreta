
import { DatabaseSync } from 'node:sqlite';
import { valuta } from './regole.mjs';
const db = new DatabaseSync('dati.db');
const partite = [];

export function parolaEsiste(parola) {
const riga = db.prepare('SELECT id FROM parole WHERE parola = ?').get(parola);
return riga !== undefined;
}

export function creaPartita() {
const riga = db.prepare('SELECT parola FROM segrete ORDER BY random() LIMIT 1').get();
const partita = {
id: partite.length + 1,
segreta: riga.parola,
tentativi: [],
finita: false
};
partite.push(partita);
return partita;
}
export function trovaPartita(id) {
for (const partita of partite) {
if (partita.id === id) {
return partita;
}
}
return null;
}
export function aggiungiTentativo(partita, parola) {
const tentativo = { parola: parola, esito: valuta(parola, partita.segreta) };
partita.tentativi.push(tentativo);
if (tentativo.esito === '=====') {
partita.finita = true;
}
return tentativo;
}
