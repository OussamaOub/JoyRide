// src/sockets/websocket.ts
import { Server } from 'socket.io';
import http from 'http';

const setupWebSocket = (server: http.Server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('WebSocket connection opened');

    socket.on('disconnect', () => {
      console.log('WebSocket connection closed');
    });

    // Handle incoming messages from the client if needed
    socket.on('message', (message) => {
      // Handle incoming WebSocket messages if needed
    });
  });

  return io;
};

export default setupWebSocket;
