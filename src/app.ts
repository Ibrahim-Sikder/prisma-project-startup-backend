import { config } from '@config/config';
import type { Logger } from '@config/logger';
import type { Express } from 'express';
import express from 'express';
import { Server } from './setupServer';

export class Application {
  private readonly logger: Logger;
  private app: Express;
  private server: Server;

  constructor() {
    this.logger = config.logger;
    this.app = express();
    this.server = new Server(this.app);

    this.loadConfig();
    this.server.configure();

    if (config.NODE_ENV !== 'test') {
      Application.handleExit(this.logger);
    }
  }

  public build(): Express {
    return this.app;
  }

  public start(): void {
    this.server.start();
  }

  private loadConfig(): void {
    config.initialize();
  }

  private static handleExit(logger: Logger): void {
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception', error, 'Application');
      Application.shutDownProperly(logger, 1);
    });

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled Rejection', reason, 'Application');
      Application.shutDownProperly(logger, 2);
    });

    process.on('SIGTERM', () => {
      logger.warn('SIGTERM received');
      Application.shutDownProperly(logger, 2);
    });

    process.on('SIGINT', () => {
      logger.warn('SIGINT received');
      Application.shutDownProperly(logger, 2);
    });

    process.on('exit', () => {
      logger.info('Process exiting');
    });
  }

  private static shutDownProperly(logger: Logger, exitCode: number): void {
    Promise.resolve()
      .then(() => {
        logger.info('Shutdown complete');
        process.exit(exitCode);
      })
      .catch((error) => {
        logger.error('Error during shutdown', error, 'Application');
        process.exit(1);
      });
  }
}
