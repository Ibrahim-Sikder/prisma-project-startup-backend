import { config } from '@config/config';
import { Logger } from '@config/logger';
import { createClient } from 'redis';

export type RedisClient = ReturnType<typeof createClient>;

export abstract class BaseCache {
  client: RedisClient;
  protected readonly log: Logger;

  constructor(cacheName: string) {
    this.client = createClient({ url: config.REDIS_URL });
    this.log = new Logger(cacheName);

    this.cacheError();
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.log.info('Redis connected');
    } catch (error) {
      this.log.error(`Redis connection failed: ${error}`);
    }
  }

  private cacheError(): void {
    this.client.on('error', (error: unknown) => {
      this.log.error(`Redis Client Error: ${error}`);
    });
  }
}
