import type { Customer } from '../entities/customer.entity.js';

export interface ICustomerRepository {
  findById(id: number): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
}

