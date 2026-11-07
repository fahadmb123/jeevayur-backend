import { Router } from 'express';
import type { AuthRouteDependencies } from '../types/auth.types.js';
import validate from '../../../shared/middlewares/validate-request.js';
import { loginSchema, refreshTokenSchema } from '../validators/auth.schema.js';

export function buildAuthRoutes(deps: AuthRouteDependencies): Router {
  const router = Router();

  router.post('/login', validate(loginSchema), deps.authController.login);
  router.post('/refresh', validate(refreshTokenSchema), deps.authController.refresh);
  router.post('/logout', deps.authController.logout);

  if (deps.authMiddleware) {
    router.get('/me', deps.authMiddleware, deps.authController.me);
  } else {
    router.get('/me', deps.authController.me);
  }

  return router;
}
