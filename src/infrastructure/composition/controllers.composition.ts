import { AuthController } from '../../presentation/controllers/auth/auth.controller.js';
import { DoctorController } from '../../presentation/controllers/doctor/doctor.controller.js';
import { HealthController } from '../../presentation/controllers/health.controller.js';
import type { EnvironmentConfig } from '../../config/environment.config.js';
import type { RepositoriesComposition } from './repositories.composition.js';
import type { ServicesComposition } from './services.composition.js';
import type { UseCasesComposition } from './useCases.composition.js';

export interface ControllersComposition {
  authController: AuthController;
  doctorController: DoctorController;
  healthController: HealthController;
}

export function buildControllers(
  useCases: UseCasesComposition,
  repositories: RepositoriesComposition,
  services: ServicesComposition,
  config: EnvironmentConfig
): ControllersComposition {
  const authController = new AuthController(
    useCases.loginUseCase,
    useCases.refreshTokenUseCase,
    services.cookieService,
    config,
    repositories.userRepository
  );
  const doctorController = new DoctorController(useCases.loginUseCase);
  const healthController = new HealthController();

  return {
    authController,
    doctorController,
    healthController,
  };
}
