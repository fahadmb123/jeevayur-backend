import type { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { BaseController } from '../../../shared/base/controller/baseController.js';
import { GetTreatmentsUseCase } from '../../../application/use-cases/treatment/getTreatments.useCase.js';
import { GetFaqsUseCase } from '../../../application/use-cases/treatment/getFaqs.useCase.js';
import { Logger } from '../../../shared/logging/Logger.js';

@injectable()
export class TreatmentController extends BaseController {
  constructor(
    private readonly getTreatmentsUseCase: GetTreatmentsUseCase,
    private readonly getFaqsUseCase: GetFaqsUseCase
  ) {
    super();
  }

  public getTreatments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
      const result = await this.getTreatmentsUseCase.execute({ search });

      this.sendSuccess(res, 'Treatments retrieved successfully', result);
    } catch (err) {
      Logger.error('[TreatmentController] Failed to get treatments:', err);
      next(err);
    }
  };

  public getFaqs = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getFaqsUseCase.execute();
      this.sendSuccess(res, 'FAQs retrieved successfully', result);
    } catch (err) {
      Logger.error('[TreatmentController] Failed to get faqs:', err);
      next(err);
    }
  };
}
