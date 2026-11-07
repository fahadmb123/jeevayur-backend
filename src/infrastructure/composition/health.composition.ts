import type { Router } from 'express';
import { CheckHealthUseCase } from '../../application/use-cases/health/system/checkHealth.useCase.js';
import { HealthController } from '../../presentation/controllers/health/health.controller.js';
import { buildHealthRoutes } from '../../presentation/routes/health/health.routes.js';

export interface HealthComposition {
  checkHealthUseCase: CheckHealthUseCase;
  healthController: HealthController;
  router: Router;
}

export function buildHealthComposition(): HealthComposition {
  const checkHealthUseCase = new CheckHealthUseCase();
  const healthController = new HealthController(checkHealthUseCase);
  const router = buildHealthRoutes({ healthController });

  return {
    checkHealthUseCase,
    healthController,
    router,
  };
}
