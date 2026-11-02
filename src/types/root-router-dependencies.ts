import type { Router } from 'express';

export interface RootRouterDependencies {
  authRoutes: Router;
  userRoutes?: Router;
  customerRoutes?: Router;
  providerServiceRoutes?: Router;
  verificationRoutes?: Router;
  providerRoutes?: Router;
  serviceRoutes?: Router;
  categoryRoutes?: Router;
  reactivationRoutes?: Router;
  notificationRoutes?: Router;
  doctorRoutes?: Router;
  healthRoutes?: Router;
}
