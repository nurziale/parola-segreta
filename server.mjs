import http from 'node:http';
import fs from 'node:fs';
import { controlla } from './regole.mjs';
import {
creaPartita, trovaPartita, aggiungiTentativo, parolaEsiste,
apriSessione, giocatoreDellaSessione, classifica
} from './archivio.mjs';
import { leggiCorpo } from './corpo.mjs';
const porta = process.env.PORTA;
function inviaJson(risposta, codice, dati) {
risposta.statusCode = codice;
risposta.setHeader('Content-Type', 'application/json; charset=utf-8');
risposta.end(JSON.stringify(dati) + '\n');
}
function descrivi(partita) {
return { id: partita.id, tentativi: partita.tentativi, finita: partita.finita };
}
function codiceSessione(richiesta) {
const cookie = richiesta.headers.cookie || '';
for (const pezzo of cookie.split('; ')) {
if (pezzo.startsWith('sessione=')) {
return pezzo.slice(9);
}
}
return '';
}
function accesso(richiesta, risposta) {
leggiCorpo(richiesta, function (dati) {
if (typeof dati.nome !== 'string' || dati.nome.trim() === '' ||
dati.nome.length > 20) {
inviaJson(risposta, 400, { errore: 'Scrivi un nome, di venti caratteri al massimo' });
} else {
const nome = dati.nome.trim();
const codice = apriSessione(nome);
risposta.setHeader('Set-Cookie', 'sessione=' + codice + '; HttpOnly');
inviaJson(risposta, 201, { nome: nome });
}
});
}
function nuovoTentativo(richiesta, risposta, partita) {
leggiCorpo(richiesta, function (dati) {
const errore = controlla(dati.parola);
if (errore !== '') {
inviaJson(risposta, 400, { errore: errore });
} else if (partita.finita) {
inviaJson(risposta, 400, { errore: 'La partita è finita' });
} else if (!parolaEsiste(dati.parola)) {
inviaJson(risposta, 400, { errore: 'Parola non in elenco' });
} else {
inviaJson(risposta, 201, aggiungiTentativo(partita, dati.parola));
}
});
}
function rispondi(richiesta, risposta) {
console.log(richiesta.method, richiesta.url);
const indirizzo = new URL(richiesta.url, 'http://localhost');
const percorso = indirizzo.pathname;
const metodo = richiesta.method;
const pezzi = percorso.split('/');
const giocatore = giocatoreDellaSessione(codiceSessione(richiesta));
if (metodo === 'GET' && percorso === '/') {
risposta.setHeader('Content-Type', 'text/html; charset=utf-8');
risposta.end(fs.readFileSync('pubblico/index.html'));
} else if (metodo === 'POST' && percorso === '/accesso') {
accesso(richiesta, risposta);
} else if (metodo === 'GET' && percorso === '/classifica') {
inviaJson(risposta, 200, classifica());
} else if (metodo === 'GET' && percorso === '/io') {
if (giocatore === null) {
inviaJson(risposta, 200, { nome: null });
} else {
inviaJson(risposta, 200, { nome: giocatore.nome });
}
} else if (giocatore === null) {
inviaJson(risposta, 401, { errore: 'Non hai fatto l\'accesso' });
} else if (metodo === 'POST' && percorso === '/partite') {
const partita = creaPartita(giocatore);
inviaJson(risposta, 201, descrivi(partita));
} else if (pezzi.length >= 3 && pezzi[1] === 'partite') {
const partita = trovaPartita(Number(pezzi[2]));
if (partita === null || partita.giocatore_id !== giocatore.id) {
inviaJson(risposta, 404, { errore: 'Partita inesistente' });
} else if (metodo === 'GET' && pezzi.length === 3) {
inviaJson(risposta, 200, descrivi(partita));
} else if (metodo === 'POST' && pezzi.length === 4 && pezzi[3] ===
'tentativi') {
nuovoTentativo(richiesta, risposta, partita);
} else {
inviaJson(risposta, 404, { errore: 'Indirizzo sconosciuto' });
}
} else {
inviaJson(risposta, 404, { errore: 'Indirizzo sconosciuto' });
}
}
const server = http.createServer(rispondi);
server.listen(porta);
console.log('Server in ascolto sulla porta', porta);

