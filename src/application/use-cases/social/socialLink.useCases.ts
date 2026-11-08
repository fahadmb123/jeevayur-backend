import type { ISocialLinkRepository } from '../../../domain/repositories/social/socialLink.repository.js';
import type { SocialLink } from '../../../domain/entities/social/socialLink.entity.js';

export class GetSocialLinksUseCase {
  constructor(private readonly repository: ISocialLinkRepository) {}

  async execute(): Promise<SocialLink[]> {
    return this.repository.findAll();
  }
}

export class BulkSaveSocialLinksUseCase {
  constructor(private readonly repository: ISocialLinkRepository) {}

  async execute(links: Array<{ id?: string; platform: string; url: string }>): Promise<SocialLink[]> {
    return this.repository.bulkSave(links);
  }
}

export class CreateSocialLinkUseCase {
  constructor(private readonly repository: ISocialLinkRepository) {}

  async execute(platform: string, url: string): Promise<SocialLink> {
    return this.repository.create(platform, url);
  }
}

export class UpdateSocialLinkUseCase {
  constructor(private readonly repository: ISocialLinkRepository) {}

  async execute(id: string, platform: string, url: string): Promise<SocialLink> {
    return this.repository.update(id, platform, url);
  }
}

export class DeleteSocialLinkUseCase {
  constructor(private readonly repository: ISocialLinkRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
