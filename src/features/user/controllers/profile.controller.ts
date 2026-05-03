import type { Request, Response } from 'express';
import { Logger } from '@config/logger';
import { ResponseHandler } from '@global/helpers/response.handler';
import { catchAsync } from '@global/decorators/catch-async';
import { zodValidation } from '@global/decorators/zod-validation';
import { NotAuthorizedError } from '@global/helpers/error-handler';
import { userService } from '@service/db/user.service';
import { userCache } from '@service/redis/user.cache';
import { updateProfileSchema } from '../schemas/profile.schema';

export class UpdateProfileController {
  private readonly log: Logger;

  constructor() {
    this.log = new Logger('UpdateProfileController');
  }

  @catchAsync()
  @zodValidation(updateProfileSchema)
  public async execute(req: Request, res: Response): Promise<void> {
    if (!req.user?.id) {
      throw new NotAuthorizedError('User not authenticated');
    }

    const userId = req.user.id;
    const { name } = req.body;

    this.log.info(`Updating profile for user: ${userId}`);

    const updatedUser = await userService.updateProfile(userId, { name });

    // Invalidate the Redis cache so the next request fetches fresh data
    const cacheKey = `user:${userId}`;
    await userCache.deleteUserFromCache(cacheKey);

    this.log.info(`Profile updated and cache invalidated for user: ${userId}`);

    ResponseHandler.updated(res, {
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  }
}
