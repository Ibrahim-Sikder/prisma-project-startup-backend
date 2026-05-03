import type { Application, Response, Request, NextFunction } from 'express';
import { json, urlencoded } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import HTTP_STATUS from 'http-status-codes';
import apiStats from 'swagger-stats';
import { config } from '@config/config';
import applicationRoutes from '@root/routes';
import { Logger } from '@config/logger';
import type { IErrorResponse } from '@global/helpers/error-handler';
import { CustomError } from '@global/helpers/error-handler';
import { apiRateLimiter } from '@global/helpers/rate-limit.helper';

export class Server {
  private app: Application;
  private readonly log: Logger;
  private isConfigured = false;

  constructor(app: Application) {
    this.app = app;
    this.log = new Logger('Server');
  }

  public start(): void {
    this.configure();
    void this.startServer(this.app);
  }

  public configure(): void {
    if (this.isConfigured) {
      return;
    }

    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.apiMonitoring(this.app);
    this.globalErrorHandler(this.app);

    this.isConfigured = true;
  }

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);

    app.use(hpp());
    app.use(helmet());
    app.use(apiRateLimiter);

    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      }),
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    // ✅ Request logging middleware
    app.use((req: Request, _res: Response, next: NextFunction) => {
      this.log.http(`${req.method} ${req.originalUrl}`);
      next();
    });
  }

  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  private apiMonitoring(app: Application): void {
    if (config.NODE_ENV === 'test') {
      return;
    }

    app.use(
      apiStats.getMiddleware({
        uriPath: '/api-monitoring',
      }),
    );
  }

  private globalErrorHandler(app: Application): void {
    app.use((req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        status: false,
        message: `${req.originalUrl} not found`,
      });
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, _next: NextFunction) => {
      this.log.error('Global error handler caught an error', error, 'Server');

      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }

      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    });
  }

  private async startServer(app: Application): Promise<void> {
    if (!config.JWT_TOKEN) {
      throw new Error('JWT_TOKEN must be provided');
    }

    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      this.log.error('Failed to start server', error, 'Server');
    }
  }

  private startHttpServer(httpServer: http.Server): void {
    this.log.info(`Worker started (PID: ${process.pid})`);

    httpServer.listen(config.PORT, () => {
      this.log.info(`Server running on port ${config.PORT}`);
    });
  }
}
