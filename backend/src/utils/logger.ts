import { createLogger, format, transports } from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = format;

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create logger instance
export const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  ),
  transports: [
    // Console transport
    new transports.Console({
      format: combine(
        colorize(),
        consoleFormat
      ),
    }),
    // Error log file
    new transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: format.json(),
    }),
    // Combined log file
    new transports.File({
      filename: path.join('logs', 'combined.log'),
      format: format.json(),
    }),
  ],
});

// Create a stream for Morgan HTTP logger
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
