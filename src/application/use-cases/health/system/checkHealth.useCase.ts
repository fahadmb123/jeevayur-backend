import type { IUseCase } from '../../../../shared/interfaces/use-cases/IUseCase.js';
import type { HealthResponseDto } from '../../../dtos/response/health/system/health.dto.js';
import type { IDatabaseHealthService } from '../../../../shared/interfaces/services/IDatabaseHealthService.js';

export class CheckHealthUseCase implements IUseCase<void, HealthResponseDto> {
  constructor(private readonly databaseHealthService?: IDatabaseHealthService) {}

  async execute(): Promise<HealthResponseDto> {
    const isConnected = this.databaseHealthService ? await this.databaseHealthService.ping() : false;
    const database = isConnected ? 'connected' : 'disconnected';

    return {
      status: database === 'connected' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      database,
    };
  }
}
