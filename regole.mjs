export function valuta(tentativo, segreta) {
let esito = '';
for (let i = 0; i < 5; i++) {
if (tentativo[i] === segreta[i]) {
esito = esito + '=';
} else if (segreta.includes(tentativo[i])) {
esito = esito + '+';
} else {
esito = esito + '-';
}
}
return esito;
}
