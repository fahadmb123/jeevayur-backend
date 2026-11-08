import { Router } from 'express';
import type { RootRouterDependencies } from './types/root-router-dependencies.js';

export function createRootRouter(dependencies: RootRouterDependencies): Router {
  const router = Router();

  router.use('/auth', dependencies.authRoutes);
  router.use('/doctor', dependencies.doctorRoutes);
  router.use('/health', dependencies.healthRoutes);

  if (dependencies.socialLinkRoutes) {
    router.use('/social-links', dependencies.socialLinkRoutes);
  }

  if (dependencies.customerRoutes) {
    router.use('/customer', dependencies.customerRoutes);
  }

  return router;
}

export { type RootRouterDependencies };

