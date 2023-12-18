// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mainrouter from './routes/mainroutes';
// // import { Server } from "socket.io";
// import http from "http";
// import setupWebSocket from './sockets/websocket';


// dotenv.config();

// const app = express();
// const server = http.createServer(app);
// export const io = setupWebSocket(server);
// // const io = new Server(server, {
// //   cors: {
// //     origin: [
// //       "http://localhost:5173",
// //     ],
// //   },
// // });

// const corsOptions = {
//   origin: 'http://localhost:5173',
//   credentials: true,
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// app.use('/api', mainrouter);



// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// io.on('connection', (socket) => {
//   console.log('Client connected');

//   // Handle Socket.IO events here

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });


// // io.on('connection', (socket) => {
// //   console.log('Client connected');

// //   // Listen for 'send_message' event from clients
// //   socket.on('send_message', (data) => {
// //     console.log('Message received');
// //     // Handle the message data, e.g., save it to the database
    
// //     // Broadcast the message to all connected clients
// //     io.emit('new_message', {
// //       // id: generateUniqueId(), // You need to implement a function to generate unique IDs
// //       ...data,
// //       created_at: new Date(),
// //     });
// //   });

// //   socket.on('disconnect', () => {
// //     console.log('Client disconnected');
// //   });
// // });



// // io.on("connection", (socket) => {
// //   const id = socket.handshake.query.id as string;
// //   socket.join(id);

// //   // activeUsers.add(parseInt(id));
// //   // io.to(socket.id).emit("online-users", Array.from(activeUsers));
// //   // socket.broadcast.emit("user-connected", parseInt(id));

// //   socket.on(
// //     "send-message",
// //     ({
// //       id,
// //       authorId,
// //       recipientId,
// //       conversationId,
// //       message,
// //       timeSent,
// //     }: {
// //       id: string;
// //       authorId: string;
// //       recipientId: string;
// //       conversationId: string;
// //       message: string;
// //       timeSent: Date;
// //     }) => {
// //       socket.broadcast.to(recipientId).emit("receive-message", {
// //         id,
// //         authorId,
// //         recipientId,
// //         conversationId,
// //         message,
// //         timeSent,
// //       });
// //     }
// //   );

// //   socket.on("disconnect", () => {
// //     // activeUsers.delete(parseInt(id));
// //     // socket.broadcast.emit("user-disconnected", parseInt(id));
// //   });
// // });

// server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mainrouter from './routes/mainroutes';
import http from "http";
import { Server } from "socket.io";
import setupWebSocket from './sockets/websocket';

dotenv.config();

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/api', mainrouter);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('Client connected');

  // Listen for 'send_message' event from clients
  socket.on('send_message', (data) => {
    // console.log('Message received');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
