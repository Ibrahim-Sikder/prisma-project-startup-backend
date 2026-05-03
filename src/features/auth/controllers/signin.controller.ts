import { Logger } from '@config/logger';
import { catchAsync } from '@global/decorators/catch-async';
import { zodValidation } from '@global/decorators/zod-validation';
import { NotAuthorizedError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { ResponseHandler } from '@global/helpers/response.handler';
import { authService } from '@service/db/auth.service';
import type { Request, Response } from 'express';
import { signinSchema } from '../schemas/signin.schema';
import { tokenCache } from '@service/redis/token.cache';
import { config } from '@config/config';

export class SignIn {
  private readonly log: Logger;

  constructor() {
    this.log = new Logger('SignInController');
  }

  @catchAsync()
  @zodValidation(signinSchema)
  public async execute(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const user = await authService.getUserByEmail(email);
    if (!user) {
      throw new NotAuthorizedError('Invalid email or password');
    }

    const isMatch = await Helpers.comparePassword(password, user.password);
    if (!isMatch) {
      throw new NotAuthorizedError('Invalid email or password');
    }

    const accessToken = Helpers.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = Helpers.generateRefreshToken({
      id: user.id,
    });

    await tokenCache.saveRefreshToken(user.id, refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV !== 'development',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV !== 'development',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    ResponseHandler.success(res, {
      message: 'Login successful',
      data: safeUser,
    });
  }
}
