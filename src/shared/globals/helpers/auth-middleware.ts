import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Logger } from '@config/logger';
import { NotAuthorizedError } from '@global/helpers/error-handler';
import { userCache } from '@service/redis/user.cache';
import { authService } from '@service/db/auth.service';
import type { User } from '@root/generated/prisma';

class AuthMiddleware {
  private readonly log: Logger;

  constructor() {
    this.log = new Logger('AuthMiddleware');
  }

  public protect = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      let token: string | undefined;

      if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        throw new NotAuthorizedError('Not authorized, token missing');
      }

      let payload: any;
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET!);
      } catch {
        throw new NotAuthorizedError('Invalid or expired token');
      }

      const userId = payload.id;
      const cacheKey = `user:${userId}`;

      let user = (await userCache.getUserFromCache(cacheKey)) as Partial<User> | null;

      if (!user) {
        this.log.info(`Cache miss for user: ${userId}`);

        user = await authService.getUserById(userId);

        if (!user) {
          throw new NotAuthorizedError('User not found');
        }

        const safeUser = {
          id: user.id,
          email: user.email,
          role: user.role,
        };

        await userCache.saveUserToCache(cacheKey, safeUser);

        user = safeUser;
      } else {
        this.log.info(`Cache hit for user: ${userId}`);
      }

      req.user = user as any;

      next();
    } catch (error) {
      next(error);
    }
  };

  public authorize = (...roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role as any)) {
        throw new NotAuthorizedError('Forbidden');
      }
      next();
    };
  };
}

export const authMiddleware = new AuthMiddleware();
