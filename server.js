const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }   // per test locale
});

// HTTP classico
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Connessioni realtime
io.on('connection', (socket) => {
  console.log('Nuovo client connesso', socket.id);

  // event dal client
  socket.on('updateState', (data) => {
    console.log('stato ricevuto', data);
    // broadcast a tutti gli altri client
    socket.broadcast.emit('stateUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnesso', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000...');
});
