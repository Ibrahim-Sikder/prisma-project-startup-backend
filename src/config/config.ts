import { env } from './env.validation';
import { Logger } from './logger';
import { CloudinaryService } from './cloudinary';

class Config {
  // Core
  public readonly NODE_ENV: string = env.NODE_ENV || 'development';
  public readonly PORT: number = env.PORT;
  public readonly API_URL: string = env.API_URL;

  // Database
  public readonly DATABASE_URL: string = env.DATABASE_URL;

  // Auth
  public readonly JWT_TOKEN: string = env.JWT_TOKEN;
  public readonly JWT_REFRESH_TOKEN: string = env.JWT_REFRESH_TOKEN;

  // Client
  public readonly CLIENT_URL: string = env.CLIENT_URL;

  // Infra
  public readonly REDIS_URL: string = env.REDIS_URL;

  // Email (optional)
  public readonly SENDER_EMAIL?: string = env.SENDER_EMAIL;
  public readonly SENDER_EMAIL_PASSWORD?: string = env.SENDER_EMAIL_PASSWORD;

  // SendGrid (optional)
  public readonly SENDGRID_API_KEY?: string = env.SENDGRID_API_KEY;
  public readonly SENDGRID_SENDER?: string = env.SENDGRID_SENDER;

  // Services
  public readonly logger: Logger;
  public readonly cloudinary: CloudinaryService;

  constructor() {
    this.logger = new Logger('casagen-api');

    // Initialize external services
    this.cloudinary = new CloudinaryService(
      env.CLOUD_NAME,
      env.CLOUD_API_KEY,
      env.CLOUD_API_SECRET,
    );
  }

  public initialize(): void {
    this.cloudinary.init();

    this.logger.info('Configuration initialized', {
      env: this.NODE_ENV,
      port: this.PORT,
    });
  }
}

export const config: Config = new Config();
