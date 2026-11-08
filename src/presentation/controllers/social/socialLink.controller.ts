import type { Request, Response, NextFunction } from 'express';
import {
  GetSocialLinksUseCase,
  BulkSaveSocialLinksUseCase,
  CreateSocialLinkUseCase,
  UpdateSocialLinkUseCase,
  DeleteSocialLinkUseCase,
} from '../../../application/use-cases/social/socialLink.useCases.js';
import { Logger } from '../../../shared/logging/Logger.js';

export class SocialLinkController {
  constructor(
    private readonly getLinksUseCase: GetSocialLinksUseCase,
    private readonly bulkSaveUseCase: BulkSaveSocialLinksUseCase,
    private readonly createUseCase: CreateSocialLinkUseCase,
    private readonly updateUseCase: UpdateSocialLinkUseCase,
    private readonly deleteUseCase: DeleteSocialLinkUseCase
  ) {}

  public getSocialLinks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const showAll = req.query.all === 'true';
      const links = await this.getLinksUseCase.execute(!showAll);
      res.status(200).json({
        success: true,
        data: links,
      });
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
        res.status(400).json({
          success: false,
          message: 'Payload must contain a "links" array.',
        });
        return;
      }

      const updated = await this.bulkSaveUseCase.execute(links);
      res.status(200).json({
        success: true,
        message: 'Social links updated successfully.',
        data: updated,
      });
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
        res.status(400).json({
          success: false,
          message: 'Both "platform" and "url" are required.',
        });
        return;
      }

      const created = await this.createUseCase.execute(platform, url, isVisible !== false);
      res.status(201).json({
        success: true,
        message: 'Social link created successfully.',
        data: created,
      });
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
        res.status(400).json({
          success: false,
          message: '"id", "platform", and "url" are required.',
        });
        return;
      }

      const updated = await this.updateUseCase.execute(id, platform, url, isVisible);
      res.status(200).json({
        success: true,
        message: 'Social link updated successfully.',
        data: updated,
      });
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
        res.status(400).json({
          success: false,
          message: 'Social link id is required.',
        });
        return;
      }

      await this.deleteUseCase.execute(id);
      res.status(200).json({
        success: true,
        message: 'Social link removed successfully.',
      });
    } catch (error) {
      Logger.error('[SocialLinkController] Failed to delete social link:', error);
      next(error);
    }
  };
}
