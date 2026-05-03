import { BaseCache } from './base.cache';

class UserCache extends BaseCache {
  constructor() {
    super('UserCache');
  }

  public async saveUserToCache(key: string, value: unknown, ttl: number = 60 * 60): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value), {
        EX: ttl, // seconds
      });

      this.log.info(`User cached → ${key}`);
    } catch (error) {
      this.log.error('Error saving user to cache', error);
    }
  }

  public async getUserFromCache<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);

      if (!data) return null;

      return JSON.parse(data) as T;
    } catch (error) {
      this.log.error('Error getting user from cache', error);
      return null;
    }
  }

  public async deleteUserFromCache(key: string): Promise<void> {
    try {
      await this.client.del(key);
      this.log.info(`User cache deleted → ${key}`);
    } catch (error) {
      this.log.error('Error deleting user cache', error);
    }
  }
}

export const userCache = new UserCache();
