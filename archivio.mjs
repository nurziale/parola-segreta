import { valuta } from './regole.mjs';

const parole = ['parco', 'sedia', 'fiume', 'gatto', 'treno'];
const partite = [];

export function creaPartita() {
const numero = Math.floor(Math.random() * parole.length);
	const partita = {
	id: partite.length + 1,
	segreta: parole[numero],
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

