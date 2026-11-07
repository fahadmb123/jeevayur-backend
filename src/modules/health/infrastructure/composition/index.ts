import type { Router } from 'express';
import { buildHealthUseCases, type HealthUseCasesComposition } from './useCases.js';
import { buildHealthControllers, type HealthControllersComposition } from './controllers.js';
import { buildHealthRoutes } from '../../presentation/routes/health.routes.js';

export interface HealthModuleComposition {
  useCases: HealthUseCasesComposition;
  controllers: HealthControllersComposition;
  router: Router;
}

export function buildHealthModule(): HealthModuleComposition {
  const useCases = buildHealthUseCases();
  const controllers = buildHealthControllers(useCases);
  const router = buildHealthRoutes({
    healthController: controllers.healthController,
  });

  return {
    useCases,
    controllers,
    router,
  };
}

export * from './useCases.js';
export * from './controllers.js';

