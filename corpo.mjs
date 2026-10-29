
export function leggiCorpo(richiesta, quandoPronto) {
	let testo = '';
	richiesta.on('data', function (pezzo) {
	testo = testo + pezzo;
});

	richiesta.on('end', function () {
	let dati = {};
	try {
	dati = JSON.parse(testo);
} catch (errore) {
dati = {};
}
if (dati === null || typeof dati !== 'object') {
dati = {};
}
quandoPronto(dati);
});
}


