import { BaseRoute } from '../../../shared/routes/base.route.js';
import type { AuthController } from '../../controllers/auth/auth.controller.js';
import { validateBody } from '../../../shared/middlewares/validation.middleware.js';
import { loginSchema } from '../../validators/auth/login.schema.js';
import { createAuthMiddleware } from '../../../shared/middlewares/auth.middleware.js';
import type { JwtTokenService } from '../../../infrastructure/services/jwtToken.service.js';
import type { EnvironmentConfig } from '../../../config/environment.config.js';

export class AuthRoutes extends BaseRoute {
  private readonly auth: ReturnType<typeof createAuthMiddleware>;

  constructor(private readonly controller: AuthController, tokens: JwtTokenService, config: EnvironmentConfig) {
    super('/auth');
    this.auth = createAuthMiddleware(tokens, config.authCookieName);
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post('/login', validateBody(loginSchema), this.controller.login);
    this.router.post('/logout', this.controller.logout);
    this.router.get('/me', this.auth, this.controller.me);
  }
}

