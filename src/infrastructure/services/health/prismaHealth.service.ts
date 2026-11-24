import type { IDatabaseHealthService } from '../../../shared/interfaces/services/IDatabaseHealthService.js';
import { db } from '../../../shared/database/client.js';

export class PrismaHealthService implements IDatabaseHealthService {
  async ping(): Promise<boolean> {
    try {
      await db.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
