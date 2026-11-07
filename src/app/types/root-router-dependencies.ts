import type { Router } from 'express';

export interface RootRouterDependencies {
  authRoutes: Router;
  doctorRoutes: Router;
  healthRoutes: Router;
  customerRoutes?: Router;
}

