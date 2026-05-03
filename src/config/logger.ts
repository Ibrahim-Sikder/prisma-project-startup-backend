import winston from 'winston';

export class Logger {
  private readonly winston: winston.Logger;

  constructor(private readonly serviceName: string) {
    const env = process.env.NODE_ENV || 'development';
    const isProd = env === 'production';

    this.winston = winston.createLogger({
      level: isProd ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        isProd
          ? winston.format.json()
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.printf(({ level, message, timestamp, stack, context }) => {
                const ctx = context ? ` [${context}]` : '';
                return `[${timestamp}] ${level}${ctx}: ${stack || message}`;
              }),
            ),
      ),
      defaultMeta: { service: serviceName },
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  info(message: string, meta?: object) {
    this.winston.info(message, meta);
  }

  error(message: string, error?: Error | unknown, context?: string) {
    const err = error instanceof Error ? error : undefined;
    this.winston.error(message, {
      context,
      stack: err?.stack,
      ...(error && !(error instanceof Error) ? { detail: error } : {}),
    });
  }

  warn(message: string, meta?: object) {
    this.winston.warn(message, meta);
  }

  debug(message: string, meta?: object) {
    this.winston.debug(message, meta);
  }

  // HTTP request logger for Express middleware
  http(message: string, meta?: object) {
    this.winston.http(message, meta);
  }
}
