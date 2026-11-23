import { Router } from 'express';
import type { YogaController } from '../../controllers/yoga/yoga.controller.js';
import validate from '../../../shared/middlewares/validate-request.js';
import {
  createYogaSessionSchema,
  updateYogaSessionSchema,
  queryYogaSchema,
} from '../../validators/yoga/yoga.schema.js';

export function buildYogaRoutes(yogaController: YogaController): Router {
  const router = Router();

  router.get('/', validate(queryYogaSchema), yogaController.getYogaSessions);
  router.get('/:id', yogaController.getYogaSessionById);
  router.post('/', validate(createYogaSessionSchema), yogaController.createYogaSession);
  router.put('/:id', validate(updateYogaSessionSchema), yogaController.updateYogaSession);
  router.delete('/:id', yogaController.deleteYogaSession);

  return router;
}
