import { BaseController } from '../../shared/controllers/BaseController.js';
export class DoctorController extends BaseController {
    login = async (req, res, next) => {
        try {
            const { email } = req.body;
            this.sendOk(res, {
                message: 'Doctor login endpoint',
                email: email ?? null,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
