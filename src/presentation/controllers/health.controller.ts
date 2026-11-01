import type { Request, Response } from 'express';
import { BaseController } from '../../shared/controllers/base.controller.js';
import prisma from '../../infrastructure/database/prisma.js';

export class HealthController extends BaseController {
  public check = async (_req: Request, res: Response): Promise<void> => {
    let dbStatus = 'disconnected';
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch {
      dbStatus = 'disconnected';
    }

    this.sendOk(res, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      database: dbStatus,
    });
  };
}

