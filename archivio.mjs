
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
