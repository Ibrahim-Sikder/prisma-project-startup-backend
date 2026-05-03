import type { Router } from 'express';
import express from 'express';
import { SignUp } from './controllers/signup.controller';
import { SignOut } from './controllers/signout.controller';
import { SignIn } from './controllers/signin.controller';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { authRateLimiter } from '@global/helpers/rate-limit.helper';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.router.use('/auth', this.routes());
  }

  public routes(): Router {
    this.router.post('/signup', authRateLimiter, SignUp.prototype.execute);
    this.router.post('/signin', authRateLimiter, SignIn.prototype.execute);
    this.router.post('/signout', authMiddleware.protect, SignOut.prototype.execute);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
