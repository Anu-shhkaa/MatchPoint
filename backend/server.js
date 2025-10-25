import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // For file uploads
import { fileURLToPath } from 'url';

// --- Import all your new route files ---
import authRoutes from './routes/authRoutes.js';
import dataRoutes from './routes/dataRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import pointsTableRoutes from './routes/pointsTableRoutes.js';
import jokerRoutes from './routes/jokerRoutes.js';

// --- Basic Setup ---
dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// --- Get __dirname in ES Modules (for file uploads) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Socket.IO Setup ---
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT'],
  },
});

// --- Middleware ---
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// --- Make 'io' accessible to our routes (VERY IMPORTANT) ---
app.set('io', io);

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.error(err));

// --- API Routes (The "Switchboard" connecting URLs to files) ---
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes); // For Sports, Teams, PointingSystems
app.use('/api/events', eventRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/pointstable', pointsTableRoutes);
app.use('/api/joker', jokerRoutes);

// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
  // You can add more socket listeners here, like 'joinRoom'
  // socket.on('joinEventRoom', (eventId) => {
  //   socket.join(eventId);
  //   console.log(`User ${socket.id} joined room ${eventId}`);
  // });
});

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
