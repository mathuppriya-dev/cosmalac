import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import dotenv from 'dotenv';
// @ts-ignore
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import inquiryRoutes from './routes/inquiryRoutes';
import blogRoutes from './routes/blogRoutes';
import cmsRoutes from './routes/cmsRoutes';
import mediaRoutes from './routes/mediaRoutes';
import { apiLimiter } from './middlewares/rateLimiter';
import { swaggerSpec } from './config/swagger';
import logger from './utils/logger';
import { isMockDB } from './config/db';

dotenv.config();

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middlewares
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// Swagger Documentation Route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rate Limiter
app.use('/api', apiLimiter);

// Static uploads folder for local files
app.use('/uploads', express.static(path.resolve(__dirname, '../../frontend/public/uploads')));

// Routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/media', mediaRoutes);

// Advanced Monitoring Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = isMockDB ? 'JSON Fallback Active' : (mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: `${Math.round(process.uptime())}s`,
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    system: {
      memoryUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      memoryTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      nodeVersion: process.version
    }
  });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Endpoint not found' });
});

// Centralized error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Error handling ${req.method} ${req.url}: ${err.message}`, err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    errors: err.errors || undefined
  });
});

export default app;
