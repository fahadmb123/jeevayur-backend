import type { EnvironmentConfig } from '../../config/environment.config.js';
import { AuthRoutes } from '../../presentation/routes/auth/auth.routes.js';
import { DoctorRoutes } from '../../presentation/routes/doctor/doctor.routes.js';
import { HealthRoutes } from '../../presentation/routes/health.routes.js';
import type { RootRouterDependencies } from '../../types/root-router-dependencies.js';
import type { ControllersComposition } from './controllers.composition.js';
import type { ServicesComposition } from './services.composition.js';

export interface RoutesComposition {
  authRoutes: AuthRoutes;
  doctorRoutes: DoctorRoutes;
  healthRoutes: HealthRoutes;
  routeDependencies: RootRouterDependencies;
}

export function buildRoutes(
  controllers: ControllersComposition,
  services: ServicesComposition,
  config: EnvironmentConfig
): RoutesComposition {
  const healthRoutes = new HealthRoutes(controllers.healthController);
  const authRoutes = new AuthRoutes(
    controllers.authController,
    services.tokenService,
    config
  );
  const doctorRoutes = new DoctorRoutes(controllers.doctorController);

  const routeDependencies: RootRouterDependencies = {
    authRoutes: authRoutes.router,
    doctorRoutes: doctorRoutes.router,
    healthRoutes: healthRoutes.router,
  };

  return {
    authRoutes,
    doctorRoutes,
    healthRoutes,
    routeDependencies,
  };
}

