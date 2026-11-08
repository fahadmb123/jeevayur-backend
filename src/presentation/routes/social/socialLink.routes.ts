import { Router, type RequestHandler } from 'express';
import { SocialLinkController } from '../../controllers/social/socialLink.controller.js';
import { roleMiddleware } from '../../../shared/middlewares/role.middleware.js';

export interface SocialLinkRouteDependencies {
  socialLinkController: SocialLinkController;
  authMiddleware?: RequestHandler;
}

export function buildSocialLinkRoutes(deps: SocialLinkRouteDependencies): Router {
  const router = Router();
  const { socialLinkController, authMiddleware } = deps;

  // Public: Accessible to customers and website visitors
  router.get('/', socialLinkController.getSocialLinks);

  // Protected: Modifying social links requires doctor/admin authentication
  const protectMiddlewares: RequestHandler[] = [];
  if (authMiddleware) {
    protectMiddlewares.push(authMiddleware);
    protectMiddlewares.push(roleMiddleware('doctor', 'admin') as RequestHandler);
  }

  router.put('/', ...protectMiddlewares, socialLinkController.bulkSaveSocialLinks);
  router.post('/', ...protectMiddlewares, socialLinkController.createSocialLink);
  router.put('/:id', ...protectMiddlewares, socialLinkController.updateSocialLink);
  router.delete('/:id', ...protectMiddlewares, socialLinkController.deleteSocialLink);

  return router;
}
