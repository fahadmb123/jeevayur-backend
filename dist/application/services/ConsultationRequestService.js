import { GetConsultationRequestsUseCase } from '../use-cases/GetConsultationRequestsUseCase.js';
import { UpdateConsultationStatusUseCase } from '../use-cases/UpdateConsultationStatusUseCase.js';
import { AppError } from '../errors/AppError.js';
export class ConsultationRequestService {
    repository;
    getConsultationRequestsUseCase;
    updateConsultationStatusUseCase;
    constructor(repository) {
        this.repository = repository;
        this.getConsultationRequestsUseCase = new GetConsultationRequestsUseCase(this.repository);
        this.updateConsultationStatusUseCase = new UpdateConsultationStatusUseCase(this.repository);
    }
    async getAllRequests() {
        return this.getConsultationRequestsUseCase.execute();
    }
    async getRequestById(id) {
        const request = await this.repository.findById(id);
        if (!request) {
            throw new AppError(`Consultation request with ID ${id} not found`, 404);
        }
        return request.toJSON();
    }
    async updateRequestStatus(id, dto) {
        return this.updateConsultationStatusUseCase.execute(id, dto);
    }
}
