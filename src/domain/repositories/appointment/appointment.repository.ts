import type { IBaseRepository } from '../../../shared/base/repository/baseRepository.js';
import type { Appointment } from '../../entities/appointment/appointment.entity.js';

export interface CreateAppointmentData {
  type: 'ayurveda treatment' | 'yoga class';
  name: string;
  email: string;
  phone: string;
  reason: string;
  format: 'online' | 'offline';
  language: string;
}

export interface IAppointmentRepository extends IBaseRepository<Appointment, string> {
  findById(id: string): Promise<Appointment | null>;
  create(data: CreateAppointmentData): Promise<Appointment>;
  findAll(): Promise<Appointment[]>;
  updateStatus(id: string, status: string): Promise<Appointment>;
}
