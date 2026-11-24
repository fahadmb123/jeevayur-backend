import crypto from 'crypto';
import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { IStorageService } from '../../../shared/interfaces/services/IStorageService.js';
import type { CreateGalleryItemRequestDto } from '../../dtos/request/gallery/createGalleryItem.dto.js';
import type { GalleryItemResponseDto } from '../../dtos/response/gallery/galleryItem.dto.js';
import { GalleryMapper } from '../../../infrastructure/mappers/gallery/gallery.mapper.js';
import { ApplicationError } from '../../../shared/errors/applicationError.js';
import { parseBase64Image } from '../../utils/imageUpload.helper.js';

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
    private readonly storageService: IStorageService
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
      await this.storageService.uploadFile(file.buffer, finalImageKey, file.mimetype || 'image/jpeg');
      finalImageUrl = `/api/gallery/images/${encodeURIComponent(finalImageKey)}`;
    } else if (finalImageUrl.startsWith('data:image/')) {
      const parsed = parseBase64Image(finalImageUrl);
      if (parsed) {
        if (parsed.buffer.length > this.maxFileSizeBytes) {
          throw new ApplicationError(
            'FILE_TOO_LARGE',
            'Image file must be less than 2MB',
            'VALIDATION'
          );
        }

        const ext = parsed.mimeType.split('/')[1] || 'jpg';
        const randomStr = crypto.randomBytes(4).toString('hex');
        finalImageKey = `gallery/${finalCategory}-${Date.now()}-${randomStr}.${ext}`;
        await this.storageService.uploadFile(parsed.buffer, finalImageKey, parsed.mimeType);
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

    const galleryItem = GalleryMapper.toDomain(dto, finalImageUrl, finalImageKey);
    const created = await this.galleryRepository.create(galleryItem);

    return GalleryMapper.toDto(created);
  }
}
