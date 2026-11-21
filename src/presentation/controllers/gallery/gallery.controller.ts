import type { Request, Response } from 'express';
import { db } from '../../../shared/database/client.js';
import { B2StorageService } from '../../../infrastructure/services/storage/b2Storage.service.js';
import { INITIAL_GALLERY_ITEMS } from './gallery.constants.js';
import type { CreateGalleryItemRequestDto } from '../../../application/dtos/request/gallery/createGalleryItem.dto.js';
import type { GalleryItemResponseDto } from '../../../application/dtos/response/gallery/galleryItem.dto.js';
import crypto from 'crypto';

export class GalleryController {
  private readonly b2Storage: B2StorageService;
  private tableEnsured: boolean = false;

  constructor(b2StorageService?: B2StorageService) {
    this.b2Storage = b2StorageService || new B2StorageService();
  }

  private async ensureTable(): Promise<void> {
    if (this.tableEnsured) return;
    try {
      await db.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "GalleryItem" (
          "id" TEXT PRIMARY KEY NOT NULL,
          "title" TEXT NOT NULL,
          "category" TEXT NOT NULL,
          "imageUrl" TEXT NOT NULL,
          "imageKey" TEXT,
          "description" TEXT,
          "author" TEXT DEFAULT 'Doctor / Wellness Admin',
          "aspectRatio" TEXT DEFAULT 'landscape',
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
      this.tableEnsured = true;
    } catch {
    }
  }

  public getGallery = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.ensureTable();

      const count = await db.galleryItem.count();
      if (count === 0) {
        for (const item of INITIAL_GALLERY_ITEMS) {
          await db.galleryItem.create({
            data: {
              id: item.id,
              title: item.title,
              category: item.category,
              imageUrl: item.imageUrl,
              description: item.description,
              author: item.author,
              aspectRatio: item.aspectRatio,
              createdAt: new Date(item.createdAt),
            },
          });
        }
      }

      const { category, search } = req.query;

      const whereClause: any = {};
      if (category && typeof category === 'string' && category !== 'all') {
        whereClause.category = category.toLowerCase();
      }

      const items = await db.galleryItem.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });

      let results: GalleryItemResponseDto[] = items.map((item) => {
        let displayUrl = item.imageUrl;
        if (item.imageKey && (!displayUrl || displayUrl.startsWith('/api/gallery/images/'))) {
          displayUrl = `/api/gallery/images/${encodeURIComponent(item.imageKey)}`;
        }
        return {
          id: item.id,
          title: item.title,
          category: item.category,
          imageUrl: displayUrl,
          imageKey: item.imageKey,
          description: item.description,
          author: item.author || 'Doctor / Wellness Admin',
          aspectRatio: item.aspectRatio || 'landscape',
          createdAt: item.createdAt.toISOString().split('T')[0],
        };
      });

      if (search && typeof search === 'string' && search.trim() !== '') {
        const query = search.trim().toLowerCase();
        results = results.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query)) ||
            (item.author && item.author.toLowerCase().includes(query))
        );
      }

      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve gallery items',
        error: error.message,
      });
    }
  };

  public getImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawKey = req.params[0] || (req.params as any).key;
      if (!rawKey) {
        res.status(400).json({ success: false, message: 'Image key is required' });
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
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: 'Image not found or could not be loaded from storage',
      });
    }
  };

  public createGalleryItem = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.ensureTable();

      const body = req.body as CreateGalleryItemRequestDto;
      const file = req.file;

      const finalCategory = (body.category || 'yoga').toLowerCase();
      let finalImageUrl = (body.imageUrl || '').trim();
      let finalImageKey: string | null = null;

      if (file) {
        const fileExt = file.originalname.split('.').pop() || 'jpg';
        const randomStr = crypto.randomBytes(4).toString('hex');
        finalImageKey = `gallery/${finalCategory}-${Date.now()}-${randomStr}.${fileExt}`;
        await this.b2Storage.uploadFile(file.buffer, finalImageKey, file.mimetype || 'image/jpeg');
        finalImageUrl = `/api/gallery/images/${encodeURIComponent(finalImageKey)}`;
      } else if (finalImageUrl.startsWith('data:image/')) {
        const matches = finalImageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          const ext = mimeType.split('/')[1] || 'jpg';
          const randomStr = crypto.randomBytes(4).toString('hex');
          finalImageKey = `gallery/${finalCategory}-${Date.now()}-${randomStr}.${ext}`;
          await this.b2Storage.uploadFile(buffer, finalImageKey, mimeType);
          finalImageUrl = `/api/gallery/images/${encodeURIComponent(finalImageKey)}`;
        }
      }

      if (!finalImageUrl) {
        res.status(400).json({
          success: false,
          message: 'Please provide an image either via upload file or valid image URL',
        });
        return;
      }

      const newItem = await db.galleryItem.create({
        data: {
          title: body.title.trim(),
          category: finalCategory,
          imageUrl: finalImageUrl,
          imageKey: finalImageKey,
          description: body.description ? body.description.trim() : null,
          author: body.author ? body.author.trim() : 'Doctor / Wellness Admin',
          aspectRatio: body.aspectRatio || 'landscape',
        },
      });

      const responseDto: GalleryItemResponseDto = {
        id: newItem.id,
        title: newItem.title,
        category: newItem.category,
        imageUrl: newItem.imageUrl,
        imageKey: newItem.imageKey,
        description: newItem.description,
        author: newItem.author,
        aspectRatio: newItem.aspectRatio,
        createdAt: newItem.createdAt.toISOString().split('T')[0],
      };

      res.status(201).json({
        success: true,
        data: responseDto,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create gallery item',
        error: error.message,
      });
    }
  };

  public deleteGalleryItem = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.ensureTable();

      const id = String(req.params.id);
      const existing = await db.galleryItem.findUnique({
        where: { id },
      });

      if (!existing) {
        res.status(404).json({ success: false, message: 'Gallery item not found' });
        return;
      }

      if (existing.imageKey) {
        await this.b2Storage.deleteFile(existing.imageKey);
      }

      await db.galleryItem.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: 'Gallery item deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete gallery item',
        error: error.message,
      });
    }
  };

  public resetDefaults = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.ensureTable();

      const existingItems = await db.galleryItem.findMany();
      for (const item of existingItems) {
        if (item.imageKey) {
          await this.b2Storage.deleteFile(item.imageKey);
        }
      }

      await db.galleryItem.deleteMany();

      for (const item of INITIAL_GALLERY_ITEMS) {
        await db.galleryItem.create({
          data: {
            id: item.id,
            title: item.title,
            category: item.category,
            imageUrl: item.imageUrl,
            description: item.description,
            author: item.author,
            aspectRatio: item.aspectRatio,
            createdAt: new Date(item.createdAt),
          },
        });
      }

      const items = await db.galleryItem.findMany({
        orderBy: { createdAt: 'desc' },
      });

      const formatted: GalleryItemResponseDto[] = items.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        imageUrl: item.imageUrl,
        imageKey: item.imageKey,
        description: item.description,
        author: item.author || 'Doctor / Wellness Admin',
        aspectRatio: item.aspectRatio || 'landscape',
        createdAt: item.createdAt.toISOString().split('T')[0],
      }));

      res.status(200).json({
        success: true,
        data: formatted,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to reset gallery defaults',
        error: error.message,
      });
    }
  };
}
