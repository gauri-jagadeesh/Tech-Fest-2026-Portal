import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware: JSON Parsing & URL Encoding
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware: CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        process.env.NODE_ENV !== 'production' ||
        allowedOrigins.some(o => o && origin.startsWith(o)) ||
        allowedOrigins.includes('*')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Primary Health Check Endpoint (Required by PDF specification)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root API Welcome & Meta Route
app.get('/', (req, res) => {
  res.json({
    service: 'Tech-Fest-2026-Portal API',
    status: 'online',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
      },
      events: {
        getAll: 'GET /api/events',
        getOne: 'GET /api/events/:id',
        create: 'POST /api/events (Admin)',
        update: 'PUT /api/events/:id (Admin)',
        delete: 'DELETE /api/events/:id (Admin)',
      },
      registrations: {
        register: 'POST /api/registrations',
        myRegistrations: 'GET /api/registrations/my',
        cancel: 'DELETE /api/registrations/:id',
        all: 'GET /api/registrations (Admin)',
      },
      users: {
        profile: 'GET/PUT /api/users/profile',
        all: 'GET /api/users (Admin)',
      },
    },
  });
});

// Mount Modular API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/users', userRoutes);

// 404 & Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Server Listening with EADDRINUSE Fallback for macOS AirPlay
let PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = (portToTry) => {
  const server = app.listen(portToTry, () => {
    console.log(`\n🚀 Tech-Fest 2026 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${portToTry}`);
    console.log(`📡 Health Check URL: http://localhost:${portToTry}/api/health\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && portToTry === 5000) {
      console.warn(`\n⚠️  Port 5000 is occupied by macOS AirPlay / ControlCenter.`);
      console.warn(`🔄 Automatically binding Tech-Fest API to fallback port 5001...`);
      startServer(5001);
    } else {
      console.error(`\n❌ Fatal Server Error:`, err);
    }
  });

  return server;
};

startServer(PORT);

export default app;
