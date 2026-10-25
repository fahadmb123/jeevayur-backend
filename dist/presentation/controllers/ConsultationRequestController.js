import { BaseController } from '../../shared/controllers/BaseController.js';
export class ConsultationRequestController extends BaseController {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    getAll = async (_req, res, next) => {
        try {
            const data = await this.service.getAllRequests();
            this.sendOk(res, data);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const data = await this.service.getRequestById(id);
            this.sendOk(res, data);
        }
        catch (error) {
            next(error);
        }
    };
    updateStatus = async (req, res, next) => {
        try {
            const id = String(req.params.id);
            const dto = req.body;
            const data = await this.service.updateRequestStatus(id, dto);
            this.sendOk(res, data);
        }
        catch (error) {
            next(error);
        }
    };
}
