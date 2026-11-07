import type { ICustomerRepository } from '../../domain/repositories/customer.repository.js';
import type { Customer } from '../../domain/entities/customer.entity.js';
import { CustomerMapper } from '../mappers/customer.mapper.js';
import { db } from '../../../../shared/database/client.js';

export class PrismaCustomerRepository implements ICustomerRepository {
  async findById(id: number): Promise<Customer | null> {
    const record = await db.user.findFirst({ where: { id, role: 'PATIENT' } });
    if (!record) return null;
    return CustomerMapper.toDomain(record);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const record = await db.user.findFirst({ where: { email, role: 'PATIENT' } });
    if (!record) return null;
    return CustomerMapper.toDomain(record);
  }
}

