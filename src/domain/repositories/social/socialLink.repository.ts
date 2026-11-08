import type { SocialLink } from '../../entities/social/socialLink.entity.js';

export interface ISocialLinkRepository {
  findAll(): Promise<SocialLink[]>;
  findById(id: string): Promise<SocialLink | null>;
  create(platform: string, url: string): Promise<SocialLink>;
  update(id: string, platform: string, url: string): Promise<SocialLink>;
  delete(id: string): Promise<void>;
  bulkSave(links: Array<{ id?: string; platform: string; url: string }>): Promise<SocialLink[]>;
}
