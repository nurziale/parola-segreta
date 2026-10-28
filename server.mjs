import http from 'node:http';
import fs from 'node:fs';
import { valuta, controlla } from './regole.mjs';
import { creaPartita, trovaPartita } from './archivio.mjs';

const porta = process.env.PORTA;
const segreta = 'parco';

function inviaJson(risposta, codice, dati) {
	risposta.statusCode = codice;
	risposta.setHeader('Content-Type', 'application/json; charset=utf-8');
	risposta.end(JSON.stringify(dati) + '\n');
}

function descrivi(partita) {
	return { id: partita.id, tentativi: partita.tentativi, finita: partita.finita };
}

function rispondi(richiesta, risposta) {
	console.log(richiesta.method, richiesta.url);
	const indirizzo = new URL(richiesta.url, 'http://localhost');
	const percorso = indirizzo.pathname;
	const metodo = richiesta.method;
	const pezzi = percorso.split('/');

	if (metodo === 'GET' && percorso === '/') {
		risposta.setHeader('Content-Type', 'text/html; charset=utf-8');
		risposta.end(fs.readFileSync('pubblico/index.html'));
	} else if (metodo === 'GET' && percorso === '/tenta') {
		const parola = indirizzo.searchParams.get('parola');
		const errore = controlla(parola);
	if (errore !== '') {
	inviaJson(risposta, 400, { errore: errore });
	} else {
	inviaJson(risposta, 200, { parola: parola, esito: valuta(parola, segreta)	
	});
	}
	} else if (metodo === 'POST' && percorso === '/partite') {
		const partita = creaPartita();
		inviaJson(risposta, 201, descrivi(partita));
	} else if (metodo === 'GET' && pezzi.length === 3 && pezzi[1] === 'partite') {
	const partita = trovaPartita(Number(pezzi[2]));
	if (partita === null) {
	inviaJson(risposta, 404, { errore: 'Partita inesistente' });
	} else {
	inviaJson(risposta, 200, descrivi(partita));
	}
	} else {
	inviaJson(risposta, 404, { errore: 'Indirizzo sconosciuto' });
	}
}
const server = http.createServer(rispondi);
server.listen(porta);
console.log('Server in ascolto sulla porta', porta);
