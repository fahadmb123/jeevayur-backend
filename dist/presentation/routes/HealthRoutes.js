import { BaseRoute } from '../../shared/routes/BaseRoute.js';
export class HealthRoutes extends BaseRoute {
    healthController;
    constructor(healthController) {
        super('/health');
        this.healthController = healthController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', this.healthController.getHealth);
    }
}
