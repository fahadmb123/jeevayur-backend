import type { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { BaseController } from '../../../shared/base/controller/baseController.js';
import {
  GetSocialLinksUseCase,
  BulkSaveSocialLinksUseCase,
  CreateSocialLinkUseCase,
  UpdateSocialLinkUseCase,
  DeleteSocialLinkUseCase,
} from '../../../application/use-cases/social/socialLink.useCases.js';
import { Logger } from '../../../shared/logging/Logger.js';

@injectable()
export class SocialLinkController extends BaseController {
  constructor(
    private readonly getLinksUseCase: GetSocialLinksUseCase,
    private readonly bulkSaveUseCase: BulkSaveSocialLinksUseCase,
    private readonly createUseCase: CreateSocialLinkUseCase,
    private readonly updateUseCase: UpdateSocialLinkUseCase,
    private readonly deleteUseCase: DeleteSocialLinkUseCase
  ) {
    super();
  }

  public getSocialLinks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const showAll = req.query.all === 'true';
      const links = await this.getLinksUseCase.execute(!showAll);
      this.sendSuccess(res, 'Social links retrieved successfully.', links);
    } catch (error) {
      Logger.error('[SocialLinkController] Failed to get social links:', error);
      next(error);
    }
  };

  public bulkSaveSocialLinks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { links } = req.body;
      if (!Array.isArray(links)) {
        this.sendBadRequest(res, 'Payload must contain a "links" array.');
        return;
      }

      const updated = await this.bulkSaveUseCase.execute(links);
      this.sendSuccess(res, 'Social links updated successfully.', updated);
    } catch (error) {
      Logger.error('[SocialLinkController] Failed to bulk save social links:', error);
      next(error);
    }
  };

  public createSocialLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { platform, url, isVisible } = req.body;
      if (!platform || !url) {
        this.sendBadRequest(res, 'Both "platform" and "url" are required.');
        return;
      }

      const created = await this.createUseCase.execute(platform, url, isVisible !== false);
      this.sendCreated(res, 'Social link created successfully.', created);
    } catch (error) {
      Logger.error('[SocialLinkController] Failed to create social link:', error);
      next(error);
    }
  };

  public updateSocialLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { platform, url, isVisible } = req.body;
      if (!id || !platform || !url) {
        this.sendBadRequest(res, '"id", "platform", and "url" are required.');
        return;
      }

      const updated = await this.updateUseCase.execute(id, platform, url, isVisible);
      this.sendSuccess(res, 'Social link updated successfully.', updated);
    } catch (error) {
      Logger.error('[SocialLinkController] Failed to update social link:', error);
      next(error);
    }
  };

  public deleteSocialLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        this.sendBadRequest(res, 'Social link id is required.');
        return;
      }

      await this.deleteUseCase.execute(id);
      this.sendSuccess(res, 'Social link removed successfully.');
    } catch (error) {
      Logger.error('[SocialLinkController] Failed to delete social link:', error);
      next(error);
    }
  };
}
