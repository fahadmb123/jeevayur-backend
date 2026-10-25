import { BaseRoute } from '../../shared/routes/BaseRoute.js';
import { HealthController } from '../controllers/HealthController.js';

export class HealthRoutes extends BaseRoute {
  constructor(private readonly healthController: HealthController) {
    super('/health');
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get('/', this.healthController.getHealth);
  }
}
