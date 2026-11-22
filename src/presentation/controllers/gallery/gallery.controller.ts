import type { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { BaseController } from '../../../shared/base/controller/baseController.js';
import { GetGalleryItemsUseCase } from '../../../application/use-cases/gallery/getGalleryItems.useCase.js';
import { CreateGalleryItemUseCase } from '../../../application/use-cases/gallery/createGalleryItem.useCase.js';
import { UpdateGalleryItemUseCase } from '../../../application/use-cases/gallery/updateGalleryItem.useCase.js';
import { DeleteGalleryItemUseCase } from '../../../application/use-cases/gallery/deleteGalleryItem.useCase.js';
import { ResetGalleryDefaultsUseCase } from '../../../application/use-cases/gallery/resetGalleryDefaults.useCase.js';
import { B2StorageService } from '../../../infrastructure/services/storage/b2Storage.service.js';
import { Logger } from '../../../shared/logging/Logger.js';

@injectable()
export class GalleryController extends BaseController {
  constructor(
    private readonly getGalleryItemsUseCase: GetGalleryItemsUseCase,
    private readonly createGalleryItemUseCase: CreateGalleryItemUseCase,
    private readonly updateGalleryItemUseCase: UpdateGalleryItemUseCase,
    private readonly deleteGalleryItemUseCase: DeleteGalleryItemUseCase,
    private readonly resetGalleryDefaultsUseCase: ResetGalleryDefaultsUseCase,
    private readonly b2Storage: B2StorageService
  ) {
    super();
  }

  public getGallery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rawCategory = typeof req.query.category === 'string' ? req.query.category.trim() : undefined;
      const category = rawCategory && rawCategory !== 'all' ? rawCategory : undefined;
      const search = typeof req.query.search === 'string' && req.query.search.trim() !== ''
        ? req.query.search.trim()
        : undefined;

      const result = await this.getGalleryItemsUseCase.execute(category, search);
      this.sendSuccess(res, 'Gallery items retrieved successfully.', result);
    } catch (error) {
      Logger.error('[GalleryController] Failed to retrieve gallery items:', error);
      next(error);
    }
  };

  public getImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rawKey = Array.isArray(req.params.key)
        ? req.params.key.join('/')
        : typeof req.params.key === 'string'
        ? req.params.key
        : (req.params as any)[0];
      if (!rawKey) {
        this.sendBadRequest(res, 'Image key is required.');
        return;
      }

      const key = decodeURIComponent(rawKey);
      const { stream, contentType, contentLength } = await this.b2Storage.getFile(key);

      res.setHeader('Content-Type', contentType);
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

      stream.pipe(res);
    } catch (error) {
      Logger.error('[GalleryController] Failed to load image from storage:', error);
      res.status(404).json({
        success: false,
        message: 'Image not found or could not be loaded from storage.',
      });
    }
  };

  public createGalleryItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.createGalleryItemUseCase.execute(req.body, req.file);
      this.sendCreated(res, 'Gallery item published successfully.', item);
    } catch (error) {
      Logger.error('[GalleryController] Failed to create gallery item:', error);
      next(error);
    }
  };

  public updateGalleryItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        this.sendBadRequest(res, 'Gallery item id is required.');
        return;
      }

      const updated = await this.updateGalleryItemUseCase.execute(id, req.body, req.file);
      this.sendSuccess(res, 'Gallery item updated successfully.', updated);
    } catch (error) {
      Logger.error('[GalleryController] Failed to update gallery item:', error);
      next(error);
    }
  };

  public deleteGalleryItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        this.sendBadRequest(res, 'Gallery item id is required.');
        return;
      }

      await this.deleteGalleryItemUseCase.execute(id);
      this.sendSuccess(res, 'Gallery item deleted successfully.');
    } catch (error) {
      Logger.error('[GalleryController] Failed to delete gallery item:', error);
      next(error);
    }
  };

  public resetDefaults = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.resetGalleryDefaultsUseCase.execute();
      this.sendSuccess(res, 'Gallery restored to clinic defaults.', items);
    } catch (error) {
      Logger.error('[GalleryController] Failed to reset gallery defaults:', error);
      next(error);
    }
  };
}
