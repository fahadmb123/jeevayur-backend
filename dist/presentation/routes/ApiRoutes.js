import { BaseRoute } from '../../shared/routes/BaseRoute.js';
export class ApiRoutes extends BaseRoute {
    subRoutes;
    constructor(subRoutes) {
        super('/api');
        this.subRoutes = subRoutes;
        this.initializeRoutes();
    }
    initializeRoutes() {
        for (const subRoute of this.subRoutes) {
            this.router.use(subRoute.path, subRoute.router);
        }
    }
}
