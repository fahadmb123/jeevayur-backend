import { Router } from 'express';
import type { HealthRouteDependencies } from '../../types/health/health.types.js';

export function buildHealthRoutes(deps: HealthRouteDependencies): Router {
  const router = Router();
  router.get('/', deps.healthController.check);
  return router;
}

