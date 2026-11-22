import type { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { BaseController } from '../../../shared/base/controller/baseController.js';
import { GetYogaSessionsUseCase } from '../../../application/use-cases/yoga/getYogaSessions.useCase.js';
import { GetYogaSessionByIdUseCase } from '../../../application/use-cases/yoga/getYogaSessionById.useCase.js';
import { CreateYogaSessionUseCase } from '../../../application/use-cases/yoga/createYogaSession.useCase.js';
import { UpdateYogaSessionUseCase } from '../../../application/use-cases/yoga/updateYogaSession.useCase.js';
import { DeleteYogaSessionUseCase } from '../../../application/use-cases/yoga/deleteYogaSession.useCase.js';
import { Logger } from '../../../shared/logging/Logger.js';

@injectable()
export class YogaController extends BaseController {
  constructor(
    private readonly getYogaSessionsUseCase: GetYogaSessionsUseCase,
    private readonly getYogaSessionByIdUseCase: GetYogaSessionByIdUseCase,
    private readonly createYogaSessionUseCase: CreateYogaSessionUseCase,
    private readonly updateYogaSessionUseCase: UpdateYogaSessionUseCase,
    private readonly deleteYogaSessionUseCase: DeleteYogaSessionUseCase
  ) {
    super();
  }

  public getYogaSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const format = typeof req.query.format === 'string' && req.query.format.trim() !== ''
        ? req.query.format.trim()
        : undefined;
      const search = typeof req.query.search === 'string' && req.query.search.trim() !== ''
        ? req.query.search.trim()
        : undefined;

      const sessions = await this.getYogaSessionsUseCase.execute(format, search);
      this.sendSuccess(res, 'Yoga sessions retrieved successfully.', sessions);
    } catch (error) {
      Logger.error('[YogaController] Failed to retrieve yoga sessions:', error);
      next(error);
    }
  };

  public getYogaSessionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const session = await this.getYogaSessionByIdUseCase.execute(id);
      if (!session) {
        this.sendBadRequest(res, `Yoga session with ID ${id} not found.`);
        return;
      }
      this.sendSuccess(res, 'Yoga session retrieved successfully.', session);
    } catch (error) {
      Logger.error('[YogaController] Failed to retrieve yoga session by ID:', error);
      next(error);
    }
  };

  public createYogaSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await this.createYogaSessionUseCase.execute(req.body);
      this.sendCreated(res, 'Yoga session scheduled successfully.', created);
    } catch (error) {
      Logger.error('[YogaController] Failed to create yoga session:', error);
      next(error);
    }
  };

  public updateYogaSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const updated = await this.updateYogaSessionUseCase.execute(id, req.body);
      this.sendSuccess(res, 'Yoga session updated successfully.', updated);
    } catch (error) {
      Logger.error('[YogaController] Failed to update yoga session:', error);
      next(error);
    }
  };

  public deleteYogaSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.deleteYogaSessionUseCase.execute(id);
      this.sendSuccess(res, 'Yoga session deleted successfully.', { id });
    } catch (error) {
      Logger.error('[YogaController] Failed to delete yoga session:', error);
      next(error);
    }
  };
}
