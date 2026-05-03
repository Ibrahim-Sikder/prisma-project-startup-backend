import { zodValidation } from '@global/decorators/zod-validation';
import type { Request, Response } from 'express';
import { signupSchema } from '../schemas/signup.schema';
import { catchAsync } from '@global/decorators/catch-async';
import { BadRequestError } from '@global/helpers/error-handler';
import { authService } from '@service/db/auth.service';
import { Helpers } from '@global/helpers/helpers';
import { Logger } from '@config/logger';
import { ResponseHandler } from '@global/helpers/response.handler';

export class SignUp {
  private readonly log: Logger;

  constructor() {
    this.log = new Logger('SignUpController');
  }

  @catchAsync()
  @zodValidation(signupSchema)
  public async execute(req: Request, res: Response): Promise<void> {
    const { name, email, password, role, vendor } = req.body;

    const existingUser = await authService.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequestError('Email is already in use');
    }

    const hashedPassword = await Helpers.hashPassword(password);

    const user = await authService.createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });

    ResponseHandler.created(res, {
      message: 'Registration successful',
      data: user,
    });
  }
}
