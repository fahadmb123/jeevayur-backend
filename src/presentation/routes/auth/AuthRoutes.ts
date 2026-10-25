import { BaseRoute } from '../../../shared/routes/BaseRoute.js';
import type { AuthController } from '../../controllers/auth/AuthController.js';
import { validateBody } from '../../../shared/middlewares/ValidationMiddleware.js';
import { loginSchema } from '../../validators/auth/login.schema.js';
import { createAuthMiddleware } from '../../../shared/middlewares/AuthMiddleware.js';
import type { JwtTokenService } from '../../../infrastructure/services/JwtTokenService.js';
import type { EnvironmentConfig } from '../../../config/EnvironmentConfig.js';

export class AuthRoutes extends BaseRoute {
  constructor(private readonly controller: AuthController, tokens: JwtTokenService, config: EnvironmentConfig) {
    super('/auth');
    this.auth = createAuthMiddleware(tokens, config.authCookieName);
    this.initializeRoutes();
  }

  private readonly auth: ReturnType<typeof createAuthMiddleware>;

  protected initializeRoutes(): void {
    this.router.post('/login', validateBody(loginSchema), this.controller.login);
    this.router.post('/logout', this.controller.logout);
    this.router.get('/me', this.auth, this.controller.me);
  }
}
