import { HealthResponseDTO } from '../dtos/health/HealthResponseDTO.js';
export class HealthService {
    healthRepository;
    constructor(healthRepository) {
        this.healthRepository = healthRepository;
    }
    async getHealth() {
        const healthStatus = await this.healthRepository.getSystemHealth();
        return new HealthResponseDTO(healthStatus);
    }
}
