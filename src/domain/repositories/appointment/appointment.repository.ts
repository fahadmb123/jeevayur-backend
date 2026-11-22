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

export interface AppointmentFilterCriteria {
  status?: string;
  type?: string;
  format?: string;
  search?: string;
}

export interface AppointmentCounts {
  all: number;
  pending: number;
  accepted: number;
  rejected: number;
}

export interface IAppointmentRepository extends IBaseRepository<Appointment, string> {
  findById(id: string): Promise<Appointment | null>;
  create(data: CreateAppointmentData): Promise<Appointment>;
  findAll(): Promise<Appointment[]>;
  findFiltered(criteria?: AppointmentFilterCriteria): Promise<Appointment[]>;
  getCounts(): Promise<AppointmentCounts>;
  updateStatus(id: string, status: string): Promise<Appointment>;
}
