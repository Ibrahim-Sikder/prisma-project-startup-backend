import { authRoutes } from '@feature/auth/auth.routes';
import { userRoutes } from '@feature/user/user.routes';

import type { Application } from 'express';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, userRoutes.routes());
  };

  routes();
};
