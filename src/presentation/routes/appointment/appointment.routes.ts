import { Router } from 'express';
import { AppointmentController } from '../../controllers/appointment/appointment.controller.js';
import validate from '../../../shared/middlewares/validate-request.js';
import { createAppointmentSchema } from '../../validators/appointment/appointment.validator.js';

export interface AppointmentRouteDependencies {
  appointmentController: AppointmentController;
}

export function buildAppointmentRoutes(deps: AppointmentRouteDependencies): Router {
  const router = Router();
  const { appointmentController } = deps;

  // Public: Patients & visitors can book appointments / consultations
  router.post('/', validate(createAppointmentSchema), appointmentController.createAppointment);

  return router;
}
