import type { Request, Response } from 'express';
import { Logger } from '@config/logger';
import { ResponseHandler } from '@global/helpers/response.handler';
import { catchAsync } from '@global/decorators/catch-async';
import { NotAuthorizedError } from '@global/helpers/error-handler';

export class MeController {
  private readonly log: Logger;

  constructor() {
    this.log = new Logger('MeController');
  }

  @catchAsync()
  public async execute(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new NotAuthorizedError('User not authenticated');
    }

    ResponseHandler.success(res, {
      message: 'Current user fetched successfully',
      data: req.user,
    });
  }
}
