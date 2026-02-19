import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { Request, Response, NextFunction } from 'express';

// Helmet security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Sanitize data to prevent NoSQL injection
export const sanitizeData = mongoSanitize({
  replaceWith: '_',
});

// XSS Protection middleware
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  // Basic XSS prevention - sanitize string inputs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      return value
        .replace(/[<>]/g, '') // Remove < and >
        .trim();
    }
    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach(key => {
        value[key] = sanitizeValue(value[key]);
      });
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
};

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Development: Allow localhost on any port
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
