const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

// LOGGER CON FILE SYSTEM

class Logger extends EventEmitter {
  constructor() {
    super();
    this.logFile = path.join(__dirname, 'logs', 'app.log');
    
    // Crea cartella logs se non esiste
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    
    // 1. Console (come prima)
    console.log(message);
    
    // 2. Salva su file (nuovo!)
    fs.appendFile(this.logFile, logEntry, (err) => {
      if (err) console.error('❌ Errore log file:', err);
    });
    
    // 3. Emette evento (come nel logger.js originale)
    this.emit('messageLogged', { 
      id: Date.now(), 
      url: 'http://localhost', 
      message 
    });
  }
}

module.exports = Logger;