import type { GalleryItem as PrismaGalleryItem } from '@prisma/client';
import { GalleryItem } from '../../../domain/entities/gallery/galleryItem.entity.js';
import type { GalleryItemResponseDto } from '../../../application/dtos/response/gallery/galleryItem.dto.js';

export class GalleryMapper {
  static toDomain(record: PrismaGalleryItem): GalleryItem {
    return new GalleryItem(
      record.id,
      record.title,
      record.category,
      record.imageUrl,
      record.imageKey,
      record.description,
      record.author,
      record.aspectRatio,
      record.createdAt,
      record.updatedAt
    );
  }

  static toDto(item: GalleryItem): GalleryItemResponseDto {
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
  }

  static toPersistence(item: GalleryItem): PrismaGalleryItem {
    return {
      id: item.id,
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      imageKey: item.imageKey,
      description: item.description,
      author: item.author || 'Doctor / Wellness Admin',
      aspectRatio: item.aspectRatio || 'landscape',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
