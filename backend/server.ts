import express, { } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://countdown-timer-alpha-nine.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

let countdown: number = 0;
let isPaused: boolean = false;
const connectedClients = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  connectedClients.set(socket.id, socket.id);
  io.emit('client-connected', socket.id); // Notify all clients about the new connection
  io.emit('connected-clients-list', Array.from(connectedClients.keys())); //send the current connected client list to the newly connected client

  socket.emit('countdown-update', { countdown, isPaused });

  try {
    socket.on('start-countdown', (duration: number) => {
      countdown = duration;
      isPaused = false;
      io.emit('countdown-update', { countdown, isPaused });
    });

    socket.on('pause-countdown', () => {
      isPaused = true;
      io.emit('countdown-update', { countdown, isPaused });
    });

    socket.on('resume-countdown', () => {
      isPaused = false;
      io.emit('countdown-update', { countdown, isPaused });
    });

    socket.on('broadcast-announcement', ({ message, duration }) => {
      console.log("Message is", message)
      io.emit('announcement', { message, duration });
    });

    socket.on('get-connected-clients', () => {
      socket.emit('connected-clients-list', Array.from(connectedClients.keys()));
    });
  } catch (error) {
    console.error('Socket event error:', error);
  }

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedClients.delete(socket.id);
    io.emit('client-disconnected', socket.id);
    io.emit('connected-clients-list', Array.from(connectedClients.keys()));
  });
});

setInterval(() => {
    if (!isPaused && countdown > 0) {
      countdown--;
      console.log('Countdown updated:', countdown);
      io.emit('countdown-update', { countdown, isPaused });
    }
  }, 1000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
