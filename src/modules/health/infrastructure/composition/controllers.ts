import { HealthController } from '../../presentation/controllers/health.controller.js';
import type { HealthUseCasesComposition } from './useCases.js';

export interface HealthControllersComposition {
  healthController: HealthController;
}

export function buildHealthControllers(useCases: HealthUseCasesComposition): HealthControllersComposition {
  return {
    healthController: new HealthController(useCases.checkHealthUseCase),
  };
}

