import { BaseCache } from './base.cache';

class TokenCache extends BaseCache {
  async saveRefreshToken(userId: string, token: string) {
    await this.client.set(`refresh:${userId}`, token, {
      EX: 60 * 60 * 24 * 7,
    });
  }

  async getRefreshToken(userId: string) {
    return this.client.get(`refresh:${userId}`);
  }

  async deleteRefreshToken(userId: string) {
    await this.client.del(`refresh:${userId}`);
  }
}

export const tokenCache = new TokenCache('token');
