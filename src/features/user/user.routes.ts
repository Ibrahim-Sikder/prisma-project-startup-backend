import { authMiddleware } from '@global/helpers/auth-middleware';
import type { Router } from 'express';
import express from 'express';
import { MeController } from './controllers/me.controller';
import { UpdateProfileController } from './controllers/profile.controller';
import { ChangePasswordController } from './controllers/password.controller';

class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.router.use('/user', this.routes());
  }

  public routes(): Router {
    this.router.get('/me', authMiddleware.protect, MeController.prototype.execute);

    this.router.patch('/me', authMiddleware.protect, UpdateProfileController.prototype.execute);

    this.router.patch(
      '/me/change-password',
      authMiddleware.protect,
      ChangePasswordController.prototype.execute,
    );

    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
