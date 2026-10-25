import { BaseRoute } from '../../../shared/routes/BaseRoute.js';
import type { DoctorController } from '../../controllers/doctor/DoctorController.js';

export class DoctorRoutes extends BaseRoute {
  constructor(private readonly doctorController: DoctorController) {
    super('/doctor');
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post('/login', this.doctorController.login);
  }
}
