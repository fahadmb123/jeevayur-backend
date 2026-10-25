import type { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../shared/controllers/BaseController.js';
import prisma from '../../infrastructure/database/prisma.js';

export class HealthController extends BaseController {
  public getHealth = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Diagnostic check: verify database connection
      await prisma.$queryRaw`SELECT 1`;

      this.sendOk(res, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())}s`,
        database: 'connected',
      });
    } catch (error) {
      next(error);
    }
  };
}
