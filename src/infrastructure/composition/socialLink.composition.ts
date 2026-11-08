import type { Router, RequestHandler } from 'express';
import { PrismaSocialLinkRepository } from '../repositories/social/prismaSocialLink.repository.js';
import {
  GetSocialLinksUseCase,
  BulkSaveSocialLinksUseCase,
  CreateSocialLinkUseCase,
  UpdateSocialLinkUseCase,
  DeleteSocialLinkUseCase,
} from '../../application/use-cases/social/socialLink.useCases.js';
import { SocialLinkController } from '../../presentation/controllers/social/socialLink.controller.js';
import { buildSocialLinkRoutes } from '../../presentation/routes/social/socialLink.routes.js';

export interface SocialLinkComposition {
  repository: PrismaSocialLinkRepository;
  controller: SocialLinkController;
  router: Router;
}

export function buildSocialLinkComposition(authMiddleware?: RequestHandler): SocialLinkComposition {
  const repository = new PrismaSocialLinkRepository();
  const getLinksUseCase = new GetSocialLinksUseCase(repository);
  const bulkSaveUseCase = new BulkSaveSocialLinksUseCase(repository);
  const createUseCase = new CreateSocialLinkUseCase(repository);
  const updateUseCase = new UpdateSocialLinkUseCase(repository);
  const deleteUseCase = new DeleteSocialLinkUseCase(repository);

  const controller = new SocialLinkController(
    getLinksUseCase,
    bulkSaveUseCase,
    createUseCase,
    updateUseCase,
    deleteUseCase
  );

  const router = buildSocialLinkRoutes({
    socialLinkController: controller,
    authMiddleware,
  });

  return {
    repository,
    controller,
    router,
  };
}
