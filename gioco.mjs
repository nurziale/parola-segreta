import { valuta } from './regole.mjs';

const segreta = 'parco';
const tentativo = process.argv[2];

console.log(tentativo);
console.log(valuta(tentativo, segreta));
