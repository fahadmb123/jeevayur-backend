import { BaseRoute } from '../../shared/routes/base.route.js';
import type { HealthController } from '../controllers/health.controller.js';

export class HealthRoutes extends BaseRoute {
  constructor(private readonly controller: HealthController) {
    super('/health');
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get('/', this.controller.check);
  }
}
