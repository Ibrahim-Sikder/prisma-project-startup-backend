import { config } from '@config/config';
import { ResponseHandler } from '@global/helpers/response.handler';
import { tokenCache } from '@service/redis/token.cache';
import type { Request, Response } from 'express';
export class SignOut {
  public async execute(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (userId) {
      await tokenCache.deleteRefreshToken(userId);
    }

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: config.NODE_ENV !== 'development',
      sameSite: 'none',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.NODE_ENV !== 'development',
      sameSite: 'none',
    });

    ResponseHandler.success(res, {
      message: 'Logged out successfully',
    });
  }
}
