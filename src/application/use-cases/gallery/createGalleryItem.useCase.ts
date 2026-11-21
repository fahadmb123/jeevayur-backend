import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { B2StorageService } from '../../../infrastructure/services/storage/b2Storage.service.js';
import type { CreateGalleryItemRequestDto } from '../../dtos/request/gallery/createGalleryItem.dto.js';
import type { GalleryItemResponseDto } from '../../dtos/response/gallery/galleryItem.dto.js';
import { ApplicationError } from '../../../shared/errors/applicationError.js';
import crypto from 'crypto';

export interface UploadFilePayload {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export class CreateGalleryItemUseCase {
  private readonly maxFileSizeBytes = 2 * 1024 * 1024;

  constructor(
    private readonly galleryRepository: IGalleryRepository,
    private readonly b2Storage: B2StorageService
  ) {}

  async execute(
    dto: CreateGalleryItemRequestDto,
    file?: UploadFilePayload
  ): Promise<GalleryItemResponseDto> {
    const finalCategory = (dto.category || 'yoga').toLowerCase();
    let finalImageUrl = (dto.imageUrl || '').trim();
    let finalImageKey: string | null = null;

    if (file) {
      if (file.size > this.maxFileSizeBytes || file.buffer.length > this.maxFileSizeBytes) {
        throw new ApplicationError(
          'FILE_TOO_LARGE',
          'Image file must be less than 2MB',
          'VALIDATION'
        );
      }

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

        if (buffer.length > this.maxFileSizeBytes) {
          throw new ApplicationError(
            'FILE_TOO_LARGE',
            'Image file must be less than 2MB',
            'VALIDATION'
          );
        }

        const ext = mimeType.split('/')[1] || 'jpg';
        const randomStr = crypto.randomBytes(4).toString('hex');
        finalImageKey = `gallery/${finalCategory}-${Date.now()}-${randomStr}.${ext}`;
        await this.b2Storage.uploadFile(buffer, finalImageKey, mimeType);
        finalImageUrl = `/api/gallery/images/${encodeURIComponent(finalImageKey)}`;
      }
    }

    if (!finalImageUrl) {
      throw new ApplicationError(
        'MISSING_IMAGE',
        'Please provide an image either via upload file or valid image URL',
        'VALIDATION'
      );
    }

    const created = await this.galleryRepository.create({
      title: dto.title.trim(),
      category: finalCategory,
      imageUrl: finalImageUrl,
      imageKey: finalImageKey,
      description: dto.description ? dto.description.trim() : null,
      author: dto.author ? dto.author.trim() : 'Doctor / Wellness Admin',
      aspectRatio: dto.aspectRatio || 'landscape',
    });

    return {
      id: created.id,
      title: created.title,
      category: created.category,
      imageUrl: created.imageUrl,
      imageKey: created.imageKey,
      description: created.description,
      author: created.author,
      aspectRatio: created.aspectRatio,
      createdAt: created.createdAt.toISOString().split('T')[0],
    };
  }
}
