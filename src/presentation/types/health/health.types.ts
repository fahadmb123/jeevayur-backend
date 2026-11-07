import type { HealthController } from '../../controllers/health/health.controller.js';

export interface HealthRouteDependencies {
  healthController: HealthController;
}

