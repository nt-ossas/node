const os = require('os');
//const fs = require('fs');
//const path = require('path');

const Logger = require('./logger.js');
const logger = new Logger();
//const config = require('./config.js');
//const db = require('./db.js');

function seeStats() {
  const ramUsed = os.totalmem() - os.freemem(); // ram disponibile
  const ramGB = (ramUsed / 1024 ** 3).toFixed(2); // in gb
  logger.log(`ram usata: ${ramGB} gb`);
}

//seeStats();
//setInterval(seeStats, 2000);

/*fs.readdir('./', function (err, files) {
    if (err) console.error('Errore nella lettura della directory:', err);
    else console.log('File nella directory corrente:', files);
});*/

const EventEmitter = require('events'); // class EventEmitter

// registrare un listener per l'evento 'messageLogged'
logger.on('messageLogged', (arg) => { // funzione anonymous come listener
    console.log('Listener chiamato ', arg);
});

logger.log('message');

const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/') { // root endpoint
        res.write('Hello World');
        res.end();
    }

    if (req.url === '/api/courses') { // endpoint
        res.write(JSON.stringify([1, 2, 3])); // invia una risposta in formato json
        res.end();
    }
});

server.on('connection', (socket) => { // listener per l'evento connection
    console.log('New connection...');
});

server.listen(3000); // porta su cui il server è in ascolto
console.log('Listening on port 3000...');