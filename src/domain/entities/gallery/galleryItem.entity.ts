export interface GalleryItemEntity {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  imageKey?: string | null;
  description?: string | null;
  author?: string | null;
  aspectRatio?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
