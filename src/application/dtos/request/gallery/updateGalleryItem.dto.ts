export interface UpdateGalleryItemRequestDto {
  title?: string;
  category?: 'yoga' | 'treatment';
  description?: string | null;
  author?: string | null;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  imageUrl?: string;
}
