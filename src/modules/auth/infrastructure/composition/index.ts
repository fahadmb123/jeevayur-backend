import type { Router } from 'express';
import type { EnvironmentConfig } from '../../../../config/environment.config.js';
import { buildAuthRepositories, type AuthRepositoriesComposition } from './repositories.js';
import { buildAuthServices, type AuthServicesComposition } from './services.js';
import { buildAuthUseCases, type AuthUseCasesComposition } from './useCases.js';
import { buildAuthControllers, type AuthControllersComposition } from './controllers.js';
import { buildAuthRoutes } from '../../presentation/routes/auth.routes.js';
import { createAuthMiddleware } from '../../../../shared/middlewares/auth.middleware.js';

export interface AuthModuleComposition {
  repositories: AuthRepositoriesComposition;
  services: AuthServicesComposition;
  useCases: AuthUseCasesComposition;
  controllers: AuthControllersComposition;
  router: Router;
}

export function buildAuthModule(config: EnvironmentConfig): AuthModuleComposition {
  const repositories = buildAuthRepositories();
  const services = buildAuthServices(config);
  const useCases = buildAuthUseCases(repositories, services);
  const controllers = buildAuthControllers(useCases, services, repositories, config);
  const authMiddleware = createAuthMiddleware(services.jwtService, config.authCookieName);

  const router = buildAuthRoutes({
    authController: controllers.authController,
    authMiddleware,
  });

  return {
    repositories,
    services,
    useCases,
    controllers,
    router,
  };
}

export * from './repositories.js';
export * from './services.js';
export * from './useCases.js';
export * from './controllers.js';
