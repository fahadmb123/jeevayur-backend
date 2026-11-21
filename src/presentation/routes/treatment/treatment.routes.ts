import { Router } from 'express';
import { TreatmentController } from '../../controllers/treatment/treatment.controller.js';

export function buildTreatmentRoutes(treatmentController: TreatmentController): Router {
  const router = Router();
  router.get('/', treatmentController.getTreatments);
  router.get('/faqs', treatmentController.getFaqs);
  return router;
}
