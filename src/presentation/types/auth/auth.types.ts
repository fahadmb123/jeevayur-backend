import type { RequestHandler } from 'express';
import type { AuthController } from '../../controllers/auth/auth.controller.js';

export interface AuthRouteDependencies {
  authController: AuthController;
  authMiddleware?: RequestHandler;
}

