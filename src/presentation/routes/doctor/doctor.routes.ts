import { BaseRoute } from '../../../shared/routes/base.route.js';
import type { DoctorController } from '../../controllers/doctor/doctor.controller.js';

export class DoctorRoutes extends BaseRoute {
  constructor(private readonly controller: DoctorController) {
    super('/doctor');
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get('/dashboard', this.controller.getDashboard);
  }
}
