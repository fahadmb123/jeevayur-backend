import { HealthStatus } from '../../core/domain/entities/HealthStatus.js';
export class SystemHealthRepository {
    config;
    constructor(config) {
        this.config = config;
    }
    async getSystemHealth() {
        return new HealthStatus('healthy', process.uptime(), new Date(), 'Jeevayurniketan Ayurveda API Server', this.config.port, this.config.nodeEnv);
    }
}
