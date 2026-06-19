import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import dsaRoutes from './routes/dsaRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';

// ─── Global Process Error Handlers (must be first) ───
process.on('uncaughtException', (err) => {
  console.error('\n[FATAL] Uncaught Exception:', err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason) => {
  console.error('\n[FATAL] Unhandled Promise Rejection:', reason);
});

// Load environment variables
dotenv.config();

// ENFORCE JWT_SECRET Validation at Startup
if (!process.env.JWT_SECRET) {
  console.error('\n================================================================');
  console.error('FATAL SYSTEM STARTUP ERROR:');
  console.error('  The environment variable "JWT_SECRET" is not defined.');
  console.error('  For security compliance, the server cannot start without a secret.');
  console.error('  Please add JWT_SECRET to your backend/.env configurations.');
  console.error('================================================================\n');
  process.exit(1);
}

// Determine __dirname in ES Modules context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Standard Middlewares
// Allow common local dev client origins and override with CLIENT_URL in production
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173', // Vite default
  'http://127.0.0.1:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin like Postman or server-to-server
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from uploads directory (created if it doesn't exist)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Brute-force rate limiting for authentication endpoints (SaaS standard)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per window
  message: {
    message: 'Too many authentication attempts from this network. Please try again in 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable legacy headers
});

// Mount routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/interviews', interviewRoutes);

// Base Status Route for checking health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'PrepPilot Backend API is fully operational',
    timestamp: new Date()
  });
});

// Placeholder for future API routes
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the PrepPilot API.',
    endpoints: ['/api/auth', '/api/companies', '/api/resumes', '/api/dsa', '/api/interviews']
  });
});

// Route Not Found Handler (404)
app.use(notFound);

// Global Error Handler (500)
app.use(errorHandler);

// ─── Async Startup Sequence ───
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. Connect to database FIRST (awaited — no floating promises)
  await connectDB();

  // 2. Start Express server AFTER DB connection is resolved
  const server = app.listen(PORT, () => {
    console.log(`Server executing in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n[FATAL] Port ${PORT} is already in use. Kill the other process or change PORT in .env\n`);
    } else {
      console.error('[FATAL] Server error:', err.message);
    }
    process.exit(1);
  });
};

startServer();
