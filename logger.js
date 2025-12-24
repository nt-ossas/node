const EventEmitter = require('events');

class Logger extends EventEmitter { // prende anche le funzionalita di EventEmitter
    log (message) {
        // Send a HTTP request
        console.log(message);

        // segnare che un evento è accaduto
        this.emit('messageLogged', {id: 1, url: 'http://'}); // passa dei parametri al listener
    }
}

module.exports = Logger;