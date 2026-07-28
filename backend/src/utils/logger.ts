import winston from 'winston';
import path from 'path';

const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    logFormat
  ),
  transports: [
    // Write logs to console with custom colors
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      )
    }),
    // Write error logs to error.log file
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../../error.log'), 
      level: 'error' 
    }),
    // Write all logs to combined.log file
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../../combined.log') 
    })
  ]
});

export default logger;
