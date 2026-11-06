import { DatabaseSync } from 'node:sqlite';
import { valuta } from './regole.mjs';
const db = new DatabaseSync('dati.db');
export function parolaEsiste(parola) {
const riga = db.prepare('SELECT id FROM parole WHERE parola = ?').get(parola);
return riga !== undefined;
}
export function creaPartita() {
const riga = db.prepare('SELECT parola FROM segrete ORDER BY random() LIMIT 1').get();
const esito = db.prepare('INSERT INTO partite (segreta) VALUES (?)').run(riga.parola);
return trovaPartita(esito.lastInsertRowid);
}
export function trovaPartita(id) {
const partita = db.prepare('SELECT id, segreta, finita FROM partite WHERE id = ?').get(id);
if (partita === undefined) {
return null;
}
const tentativi = db.prepare('SELECT parola, esito FROM tentativi WHERE partita_id = ? ORDER BY id').all(id);
return {
id: partita.id,
segreta: partita.segreta,
tentativi: tentativi,
finita: partita.finita === 1
};
}
export function aggiungiTentativo(partita, parola) {
const esito = valuta(parola, partita.segreta);
db.prepare('INSERT INTO tentativi (partita_id, parola, esito) VALUES (?, ?, ?)').run(partita.id, parola, esito);
if (esito === '=====') {
db.prepare('UPDATE partite SET finita = 1 WHERE id = ?').run(partita.id);
}
return { parola: parola, esito: esito };
}
