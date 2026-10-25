export class GetConsultationRequestsUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute() {
        const requests = await this.repository.findAll();
        return requests.map((request) => request.toJSON());
    }
}
