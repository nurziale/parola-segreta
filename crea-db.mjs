import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('dati.db');
db.exec('DROP TABLE IF EXISTS tentativi');
db.exec('DROP TABLE IF EXISTS partite');
db.exec('DROP TABLE IF EXISTS parole');
db.exec('DROP TABLE IF EXISTS segrete');
db.exec('CREATE TABLE parole (id INTEGER PRIMARY KEY, parola TEXT NOT NULL UNIQUE)');
db.exec('CREATE TABLE segrete (id INTEGER PRIMARY KEY, parola TEXT NOT NULL UNIQUE)');
db.exec(`CREATE TABLE partite (
id INTEGER PRIMARY KEY,
segreta TEXT NOT NULL,
finita INTEGER NOT NULL DEFAULT 0
)`);
db.exec(`CREATE TABLE tentativi (
id INTEGER PRIMARY KEY,
partita_id INTEGER NOT NULL REFERENCES partite(id),
parola TEXT NOT NULL,
esito TEXT NOT NULL
)`);
db.exec('BEGIN');
const inserisciParola = db.prepare('INSERT INTO parole (parola) VALUES (?)');
for (const riga of fs.readFileSync('parole.txt', 'utf8').split('\n')) {
if (riga !== '') {
inserisciParola.run(riga);
}
}
const inserisciSegreta = db.prepare('INSERT INTO segrete (parola) VALUES (?)');
for (const riga of fs.readFileSync('segrete.txt', 'utf8').split('\n')) {
if (riga !== '') {
inserisciSegreta.run(riga);
}
}
db.exec('COMMIT');
const parole = db.prepare('SELECT count(*) AS quante FROM parole').get();
const segrete = db.prepare('SELECT count(*) AS quante FROM segrete').get();
console.log('Parole ammesse:', parole.quante);
console.log('Parole segrete:', segrete.quante);
