import type { Request, Response } from 'express';
import { Logger } from '@config/logger';
import { ResponseHandler } from '@global/helpers/response.handler';
import { catchAsync } from '@global/decorators/catch-async';
import { zodValidation } from '@global/decorators/zod-validation';
import { BadRequestError, NotAuthorizedError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { userService } from '@service/db/user.service';
import { userCache } from '@service/redis/user.cache';
import { changePasswordSchema } from '../schemas/password.schema';

export class ChangePasswordController {
  private readonly log: Logger;

  constructor() {
    this.log = new Logger('ChangePasswordController');
  }

  @catchAsync()
  @zodValidation(changePasswordSchema)
  public async execute(req: Request, res: Response): Promise<void> {
    if (!req.user?.id) {
      throw new NotAuthorizedError('User not authenticated');
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    this.log.info(`Change password request for user: ${userId}`);

    // 1. Fetch the full user record (including password hash)
    const user = await userService.getUserByIdWithPassword(userId);
    if (!user) {
      throw new NotAuthorizedError('User not found');
    }

    // 2. Verify the current password is correct
    const isMatch = await Helpers.comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestError('Current password is incorrect');
    }

    // 3. Hash the new password and persist it
    const hashedPassword = await Helpers.hashPassword(newPassword);
    await userService.changePassword(userId, hashedPassword);

    // 4. Invalidate Redis cache so fresh data is served
    const cacheKey = `user:${userId}`;
    await userCache.deleteUserFromCache(cacheKey);

    this.log.info(`Password changed and cache invalidated for user: ${userId}`);

    ResponseHandler.updated(res, {
      message: 'Password changed successfully',
    });
  }
}
