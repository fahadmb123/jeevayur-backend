import { AuthController } from '../../presentation/controllers/auth.controller.js';
import type { AuthUseCasesComposition } from './useCases.js';
import type { AuthServicesComposition } from './services.js';
import type { AuthRepositoriesComposition } from './repositories.js';
import type { EnvironmentConfig } from '../../../../config/environment.config.js';

export interface AuthControllersComposition {
  authController: AuthController;
}

export function buildAuthControllers(
  useCases: AuthUseCasesComposition,
  services: AuthServicesComposition,
  repositories: AuthRepositoriesComposition,
  config: EnvironmentConfig
): AuthControllersComposition {
  return {
    authController: new AuthController(
      useCases.loginUseCase,
      useCases.refreshTokenUseCase,
      services.cookieService,
      config,
      repositories.userRepository
    ),
  };
}
