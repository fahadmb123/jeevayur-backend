export interface HealthResponseDto {
  status: 'healthy' | 'degraded';
  timestamp: string;
  uptime: string;
  database: 'connected' | 'disconnected';
}
