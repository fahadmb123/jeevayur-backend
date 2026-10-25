import { AppError } from '../errors/AppError.js';
export class UpdateConsultationStatusUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id, dto) {
        const request = await this.repository.findById(id);
        if (!request) {
            throw new AppError(`Consultation request with ID ${id} not found`, 404);
        }
        if (dto.status === 'accepted') {
            request.accept();
        }
        else {
            if (!dto.rejectionReason) {
                throw new AppError('Rejection reason is required when rejecting a request', 400);
            }
            request.reject(dto.rejectionReason);
        }
        await this.repository.save(request);
        return request.toJSON();
    }
}
