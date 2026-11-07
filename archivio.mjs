import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { valuta } from './regole.mjs';
const db = new DatabaseSync('dati.db');
export function parolaEsiste(parola) {
const riga = db.prepare('SELECT id FROM parole WHERE parola = ?').get(parola);
return riga !== undefined;
}
export function apriSessione(nome) {
let giocatore = db.prepare('SELECT id FROM giocatori WHERE nome = ?').get(nome);
if (giocatore === undefined) {
const esito = db.prepare('INSERT INTO giocatori (nome) VALUES (?)').run(nome);
giocatore = { id: esito.lastInsertRowid };
}
const codice = crypto.randomUUID();
db.prepare('INSERT INTO sessioni (codice, giocatore_id) VALUES (?, ?)').run(codice, giocatore.id);
return codice;
}
export function giocatoreDellaSessione(codice) {
const riga = db.prepare(`SELECT giocatori.id, giocatori.nome
FROM sessioni JOIN giocatori ON giocatori.id = sessioni.giocatore_id
WHERE sessioni.codice = ?`).get(codice);
if (riga === undefined) {
return null;
}
return riga;
}
export function creaPartita(giocatore) {
const riga = db.prepare('SELECT parola FROM segrete ORDER BY random() LIMIT 1').get();
const esito = db.prepare('INSERT INTO partite (giocatore_id, segreta) VALUES (?, ?)').run(giocatore.id, riga.parola);
return trovaPartita(esito.lastInsertRowid);
}
export function trovaPartita(id) {
const partita = db.prepare('SELECT id, giocatore_id, segreta, finita FROM partite WHERE id = ?').get(id);
if (partita === undefined) {
return null;
}
const tentativi = db.prepare('SELECT parola, esito FROM tentativi WHERE partita_id = ? ORDER BY id').all(id);
return {
id: partita.id,
giocatore_id: partita.giocatore_id,
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
export function classifica() {
return db.prepare(`SELECT giocatori.nome, count(*) AS vinte
FROM partite JOIN giocatori ON giocatori.id = partite.giocatore_id
WHERE partite.finita = 1
GROUP BY giocatori.id
ORDER BY vinte DESC, giocatori.nome`).all();
}
