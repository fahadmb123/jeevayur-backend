import type { Router } from 'express';

export interface RootRouterDependencies {
  authRoutes: Router;
  doctorRoutes: Router;
  healthRoutes: Router;
  socialLinkRoutes?: Router;
  customerRoutes?: Router;
  appointmentRoutes?: Router;
}
