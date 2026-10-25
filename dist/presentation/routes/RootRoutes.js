import { BaseRoute } from '../../shared/routes/BaseRoute.js';
export class RootRoutes extends BaseRoute {
    rootController;
    constructor(rootController) {
        super('/');
        this.rootController = rootController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', this.rootController.getRoot);
    }
}
