import { Router } from 'express';
import type { AuthRouteDependencies } from '../../types/auth/auth.types.js';
import validate from '../../../shared/middlewares/validate-request.js';
import {
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from '../../validators/auth/auth.schema.js';

export function buildAuthRoutes(deps: AuthRouteDependencies): Router {
  const router = Router();

  router.post('/login', validate(loginSchema), deps.authController.login);
  router.post('/refresh', validate(refreshTokenSchema), deps.authController.refresh);
  router.post('/logout', deps.authController.logout);
  router.post('/forgot-password', validate(forgotPasswordSchema), deps.authController.forgotPassword);
  router.get('/verify-reset-token', deps.authController.verifyResetToken);
  router.post('/reset-password', validate(resetPasswordSchema), deps.authController.resetPassword);

  if (deps.authMiddleware) {
    router.get('/me', deps.authMiddleware, deps.authController.me);
    router.put('/profile', deps.authMiddleware, validate(updateProfileSchema), deps.authController.updateProfile);
    router.put('/me', deps.authMiddleware, validate(updateProfileSchema), deps.authController.updateProfile);
    router.get('/sessions', deps.authMiddleware, deps.authController.getSessions);
    router.delete('/sessions/:sessionId', deps.authMiddleware, deps.authController.revokeSession);
  } else {
    router.get('/me', deps.authController.me);
    router.put('/profile', validate(updateProfileSchema), deps.authController.updateProfile);
    router.put('/me', validate(updateProfileSchema), deps.authController.updateProfile);
  }

  return router;
}
