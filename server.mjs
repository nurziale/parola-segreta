import http from 'node:http';

const porta = process.env.PORTA;


function rispondi(richiesta, risposta) {
	
	console.log(richiesta.method, richiesta.url);
	risposta.setHeader('Content-Type', 'text/plain; charset=utf-8');

	if (richiesta.url === '/') {
	risposta.end('Qui Parola segreta\n');
	} else if (richiesta.url === '/regole') {
	risposta.end('Indovina la parola di cinque lettere.\n');
	} else {
	risposta.statusCode = 404;
	risposta.end('Indirizzo sconosciuto\n');
	}

}
	const server = http.createServer(rispondi);
	server.listen(porta);
	console.log('Server in ascolto sulla ciaoooooo porta', porta);
