export class GalleryItem {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly category: string,
    public readonly imageUrl: string,
    public readonly imageKey: string | null = null,
    public readonly description: string | null = null,
    public readonly author: string | null = 'Doctor / Wellness Admin',
    public readonly aspectRatio: string | null = 'landscape',
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}
}

export type GalleryItemEntity = GalleryItem;
