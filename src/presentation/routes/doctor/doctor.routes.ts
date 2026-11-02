import type { RequestHandler } from 'express';
import { BaseRoute } from '../../../shared/routes/base.route.js';
import type { DoctorController } from '../../controllers/doctor/doctor.controller.js';
import { requireRole } from '../../../shared/middlewares/auth.middleware.js';

export class DoctorRoutes extends BaseRoute {
  constructor(
    private readonly controller: DoctorController,
    private readonly authMiddleware?: RequestHandler
  ) {
    super('/doctor');
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    if (this.authMiddleware) {
      this.router.use(this.authMiddleware);
      this.router.use(requireRole('doctor', 'admin'));
    }
    this.router.get('/dashboard', this.controller.getDashboard);
  }
}
