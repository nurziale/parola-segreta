import http from 'node:http';

import { valuta } from './regole.mjs';

const porta = process.env.PORTA;
const segreta = 'porco';

function rispondi(richiesta, risposta) {
	console.log(richiesta.method, richiesta.url);
	risposta.setHeader('Content-Type', 'text/plain; charset=utf-8');

	const indirizzo = new URL(richiesta.url, 'http://localhost');
	const percorso = indirizzo.pathname;

	if (percorso === '/') {
	risposta.end('Qui Parola segreta\n');
	} else if (percorso === '/regole') {
	risposta.end('Indovina la parola di cinque lettere.\n');
	} else if (percorso === '/tenta') {
	const parola = indirizzo.searchParams.get('parola');
	risposta.end(valuta(parola, segreta) + '\n');
	} else {
	risposta.statusCode = 404;
	risposta.end('Indirizzo sconosciuto\n');
	}
}
const server = http.createServer(rispondi);
server.listen(porta);
console.log('Server in ascolto sulla porta', porta);
