import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/job.routes';
import applicationRoutes from './routes/application.routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { logger, morganStream } from './utils/logger';
import { securityHeaders, sanitizeData, xssProtection, corsOptions } from './middleware/security';
import { apiLimiter } from './middleware/rateLimit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Security Middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(sanitizeData);
app.use(xssProtection);

// Request logging
app.use(morgan('combined', { stream: morganStream }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api', apiLimiter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI Hiring Platform API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use(notFound);

// Global error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🔒 Security features enabled`);
});

export default app;
