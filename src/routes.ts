import { Router } from 'express';
import type { RootRouterDependencies } from './types/root-router-dependencies.js';

export function createRootRouter(route: RootRouterDependencies): Router {
  const router = Router();
  const emptyRouter = () => Router();

  router.use('/auth', route.authRoutes || emptyRouter());
  router.use('/user', route.userRoutes || emptyRouter());
  router.use('/customer', route.customerRoutes || emptyRouter());
  router.use('/provider/service', route.providerServiceRoutes || emptyRouter());
  router.use('/provider/verification', route.verificationRoutes || emptyRouter());
  router.use('/provider', route.providerRoutes || emptyRouter());
  router.use('/verification', route.verificationRoutes || emptyRouter());
  router.use('/service', route.serviceRoutes || emptyRouter());
  router.use('/category', route.categoryRoutes || emptyRouter());
  router.use('/reactivation', route.reactivationRoutes || emptyRouter());
  router.use('/notification', route.notificationRoutes || emptyRouter());

  if (route.doctorRoutes) {
    router.use('/doctor', route.doctorRoutes);
  }
  if (route.healthRoutes) {
    router.use('/health', route.healthRoutes);
  }

  return router;
}

export { type RootRouterDependencies };
