import type { GalleryItemEntity } from '../../entities/gallery/galleryItem.entity.js';

export interface IGalleryRepository {
  findAll(category?: string, search?: string): Promise<GalleryItemEntity[]>;
  findById(id: string): Promise<GalleryItemEntity | null>;
  create(data: {
    id?: string;
    title: string;
    category: string;
    imageUrl: string;
    imageKey?: string | null;
    description?: string | null;
    author?: string | null;
    aspectRatio?: string | null;
    createdAt?: Date;
  }): Promise<GalleryItemEntity>;
  delete(id: string): Promise<void>;
  resetDefaults(initialItems: Array<{
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    description: string;
    author: string;
    aspectRatio: string;
    createdAt: string;
  }>): Promise<GalleryItemEntity[]>;
}
