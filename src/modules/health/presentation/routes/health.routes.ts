import { Router } from 'express';
import type { HealthController } from '../controllers/health.controller.js';

export interface HealthRouteDependencies {
  healthController: HealthController;
}

export function buildHealthRoutes(deps: HealthRouteDependencies): Router {
  const router = Router();
  router.get('/', deps.healthController.check);
  return router;
}

