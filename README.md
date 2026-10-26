#PAROLA SEGRETA
gioco in rete: il serever decide una paroladi 5 lettere da indovinare, e l'user deve indovinarla 

## API
- POST /partite : comincia una partita. Risposta 201.
- GET /partite/N : stato della partita N. Risposta 200, oppure 404.
- POST /partite/N/tentativi : propone una parola, nel corpo in JSON.
Risposta 201, oppure 400 o 404.

Alessandro Nurzia 5ci
