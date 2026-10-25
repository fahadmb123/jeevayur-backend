export class HealthStatus {
    status;
    uptimeSeconds;
    timestamp;
    serviceName;
    port;
    environment;
    constructor(status, uptimeSeconds, timestamp, serviceName, port, environment) {
        this.status = status;
        this.uptimeSeconds = uptimeSeconds;
        this.timestamp = timestamp;
        this.serviceName = serviceName;
        this.port = port;
        this.environment = environment;
    }
    get formattedUptime() {
        return `${Math.floor(this.uptimeSeconds)}s`;
    }
    get isoTimestamp() {
        return this.timestamp.toISOString();
    }
}
