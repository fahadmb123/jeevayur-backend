import type { IBaseRepository } from '../../../shared/base/repository/baseRepository.js';
import type { Patient } from '../../entities/patient/patient.entity.js';

export interface CreatePatientData {
  name: string;
  email?: string | null;
  phone?: string | null;
  gender?: string | null;
  age?: number | null;
  condition?: string | null;
  status?: string;
  lastVisit?: string | null;
}

export interface IPatientRepository extends IBaseRepository<Patient, string> {
  create(data: CreatePatientData): Promise<Patient>;
  findAll(): Promise<Patient[]>;
  findById(id: string): Promise<Patient | null>;
  findByEmail(email: string): Promise<Patient | null>;
  updateStatus(id: string, status: string): Promise<Patient>;
}

