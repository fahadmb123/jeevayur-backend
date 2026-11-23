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

  if (dependencies.appointmentRoutes) {
    router.use('/appointments', dependencies.appointmentRoutes);
  }

  if (dependencies.patientRoutes) {
    router.use('/patients', dependencies.patientRoutes);
  }

  if (dependencies.treatmentRoutes) {
    router.use('/treatments', dependencies.treatmentRoutes);
    router.use('/services', dependencies.treatmentRoutes);
  }

  if (dependencies.galleryRoutes) {
    router.use('/gallery', dependencies.galleryRoutes);
  }

  if (dependencies.yogaRoutes) {
    router.use('/yoga', dependencies.yogaRoutes);
  }

  return router;
}

export { type RootRouterDependencies };
