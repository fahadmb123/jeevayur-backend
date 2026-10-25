export class HealthResponseDTO {
    status;
    uptime;
    timestamp;
    environment;
    port;
    service;
    constructor(health) {
        this.status = health.status;
        this.uptime = health.formattedUptime;
        this.timestamp = health.isoTimestamp;
        this.environment = health.environment;
        this.port = health.port;
        this.service = health.serviceName;
    }
}
