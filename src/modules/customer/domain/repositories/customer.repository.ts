import type { BaseRepository } from '../../../../shared/base/repository/baseRepository.js';
import type { Customer } from '../entities/customer.entity.js';

export interface ICustomerRepository extends BaseRepository<Customer> {
  findById(id: number): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
}
