import { Router, type RequestHandler } from 'express';
import { AppointmentController } from '../../controllers/appointment/appointment.controller.js';
import validate from '../../../shared/middlewares/validate-request.js';
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from '../../validators/appointment/appointment.validator.js';

export interface AppointmentRouteDependencies {
  appointmentController: AppointmentController;
  authMiddleware?: RequestHandler;
}

export function buildAppointmentRoutes(deps: AppointmentRouteDependencies): Router {
  const router = Router();
  const { appointmentController, authMiddleware } = deps;

  router.post('/', validate(createAppointmentSchema), appointmentController.createAppointment);

  if (authMiddleware) {
    router.get('/', authMiddleware, appointmentController.getAppointments);
    router.patch('/:id/status', authMiddleware, validate(updateAppointmentStatusSchema), appointmentController.updateStatus);
  } else {
    router.get('/', appointmentController.getAppointments);
    router.patch('/:id/status', validate(updateAppointmentStatusSchema), appointmentController.updateStatus);
  }

  return router;
}
