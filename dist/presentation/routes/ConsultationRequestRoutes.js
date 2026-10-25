import { BaseRoute } from './BaseRoute.js';
export class ConsultationRequestRoutes extends BaseRoute {
    controller;
    constructor(controller) {
        super('/consultation-requests');
        this.controller = controller;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', this.controller.getAll);
        this.router.get('/:id', this.controller.getById);
        this.router.patch('/:id/status', this.controller.updateStatus);
    }
}
