const os = require('os');
const fs = require('fs');
const path = require('path');

// IMPORT ESTERNI (da npm install)
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

// IMPORT LOCALI (tuoi file)
const Logger = require('./logger'); // Il tuo logger

// INIZIALIZZAZIONE

const app = express();
const server = createServer(app); // HTTP server per Express + Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Permette tutti i domini (per test)
    methods: ["GET", "POST"]
  }
});

const logger = new Logger(); // Istanza del tuo logger

// MIDDLEWARE EXPRESS

app.use(express.static('public')); // Serve file statici (HTML, CSS, JS)
app.use(express.json()); // Parse JSON bodies

// ROUTES HTTP CLASSICHE

// Endpoint root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint (dal tuo app.js)
app.get('/api/courses', (req, res) => {
  res.json([1, 2, 3]); // Esempio dati
});

// Stats sistema (dal tuo app.js)
app.get('/api/stats', (req, res) => {
  const ramUsed = os.totalmem() - os.freemem();
  const ramGB = (ramUsed / 1024 ** 3).toFixed(2);
  res.json({ ramGB, uptime: os.uptime() });
});

// SOCKET.IO REALTIME (SINCRO!)

io.on('connection', (socket) => {
  console.log('✅ Client connesso:', socket.id);
  
  // Quando client manda un update
  socket.on('updateState', (data) => {
    console.log('📡 Stato ricevuto:', data);
    
    // SALVA SU LOG (usa il tuo logger!)
    logger.log(`Client ${socket.id}: ${JSON.stringify(data)}`);
    
    // INVIA A TUTTI GLI ALTRI CLIENT (broadcast)
    socket.broadcast.emit('stateUpdated', data);
  });

  // Client si disconnette
  socket.on('disconnect', () => {
    console.log('❌ Client disconnesso:', socket.id);
  });
});

// EVENT LISTENER LOGGER (da app.js)

logger.on('messageLogged', (arg) => {
  console.log('🔔 Logger evento:', arg);
  // Opzionale: invia log realtime ai client admin
  // io.emit('newLog', arg);
});

// AVVIO SERVER (IMPORTANTE PER RENDER)

const PORT = process.env.PORT || 3000; // Render assegna porta dinamica
server.listen(PORT, '0.0.0.0', () => { // '0.0.0.0' obbligatorio per Render
  console.log(`🚀 Server live su porta ${PORT}`);
  console.log(`📱 Testa: http://localhost:${PORT}`);
  
  // Stats iniziali (dal tuo app.js)
  const ramUsed = os.totalmem() - os.freemem();
  const ramGB = (ramUsed / 1024 ** 3).toFixed(2);
  console.log(`💾 RAM usata: ${ramGB} GB`);
});