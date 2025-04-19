import winston from 'winston';

// Create a logger instance with multiple transports
export const logger = winston.createLogger({
  level: 'info', // Set default log level
  format: winston.format.combine(
    winston.format.colorize(), // Colorize output
    winston.format.simple() // Log in a simple format
  ),
  transports: [
    // Log to the console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Optionally log to a file (comment out if not needed)
    new winston.transports.File({ filename: 'logs/app.log' })
  ],
});
