import { BaseRoute } from '../../../shared/routes/BaseRoute.js';
export class DoctorRoutes extends BaseRoute {
    doctorController;
    constructor(doctorController) {
        super('/doctor');
        this.doctorController = doctorController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/login', this.doctorController.login);
    }
}
