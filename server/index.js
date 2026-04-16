const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const peers = new Map(); // userId -> peerId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register-peer', (peerId) => {
    socket.peerId = peerId;
    peers.set(peerId, socket.id);
    console.log('Peer registered:', peerId);
  });

  socket.on('disconnect', () => {
    if (socket.peerId) {
      peers.delete(socket.peerId);
    }
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
