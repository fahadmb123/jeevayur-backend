import type { RequestHandler } from 'express';
import { BaseRoute } from '../../../shared/routes/base.route.js';
import type { DoctorController } from '../../controllers/doctor/doctor.controller.js';
import { roleMiddleware } from '../../../shared/middlewares/role.middleware.js';

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
      this.router.use(roleMiddleware('doctor', 'admin'));
    }
    this.router.get('/dashboard', this.controller.getDashboard);
  }
}
