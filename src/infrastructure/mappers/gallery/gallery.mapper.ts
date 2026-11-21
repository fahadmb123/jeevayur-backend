import type { GalleryItem as PrismaGalleryItem } from '@prisma/client';
import { GalleryItem } from '../../../domain/entities/gallery/galleryItem.entity.js';
import type { CreateGalleryItemRequestDto } from '../../../application/dtos/request/gallery/createGalleryItem.dto.js';
import type { GalleryItemResponseDto } from '../../../application/dtos/response/gallery/galleryItem.dto.js';
import crypto from 'crypto';

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

  static toDomainFromCreateDto(
    dto: CreateGalleryItemRequestDto,
    imageUrl: string,
    imageKey: string | null = null
  ): GalleryItem {
    return new GalleryItem(
      crypto.randomUUID(),
      dto.title.trim(),
      (dto.category || 'yoga').toLowerCase(),
      imageUrl,
      imageKey,
      dto.description ? dto.description.trim() : null,
      dto.author ? dto.author.trim() : 'Doctor / Wellness Admin',
      dto.aspectRatio || 'landscape',
      new Date(),
      new Date()
    );
  }

  static toDomainFromInitial(item: {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    description: string;
    author: string;
    aspectRatio: string;
    createdAt: string;
  }): GalleryItem {
    return new GalleryItem(
      item.id,
      item.title,
      item.category,
      item.imageUrl,
      null,
      item.description,
      item.author,
      item.aspectRatio,
      new Date(item.createdAt),
      new Date(item.createdAt)
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
