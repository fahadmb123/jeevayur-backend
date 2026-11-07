import type { IUseCase } from '../../../../shared/interfaces/use-cases/IUseCase.js';
import type { HealthResponseDto } from '../../../dtos/response/health/health.dto.js';
import { db } from '../../../../shared/database/client.js';

export class CheckHealthUseCase implements IUseCase<void, HealthResponseDto> {
  async execute(): Promise<HealthResponseDto> {
    let database: 'connected' | 'disconnected' = 'disconnected';

    try {
      await db.$queryRaw`SELECT 1`;
      database = 'connected';
    } catch {
      database = 'disconnected';
    }

    return {
      status: database === 'connected' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      database,
    };
  }
}

