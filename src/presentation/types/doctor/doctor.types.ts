import type { RequestHandler } from 'express';
import type { DoctorController } from '../../controllers/doctor/doctor.controller.js';

export interface DoctorRouteDependencies {
  doctorController: DoctorController;
  authMiddleware?: RequestHandler;
}

