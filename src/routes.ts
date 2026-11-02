import { Router } from 'express';
import type { RootRouterDependencies } from './types/root-router-dependencies.js';

export function createRootRouter(route: RootRouterDependencies): Router {
  const router = Router();

  router.use('/auth', route.authRoutes);
  router.use('/doctor', route.doctorRoutes);
  router.use('/health', route.healthRoutes);

  if (route.customerRoutes) {
    router.use('/customer', route.customerRoutes);
  }

  return router;
}

export { type RootRouterDependencies };
