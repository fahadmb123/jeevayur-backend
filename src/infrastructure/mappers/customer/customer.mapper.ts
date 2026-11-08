import type { User as PrismaUser } from '@prisma/client';
import { Customer } from '../../../domain/entities/customer/customer.entity.js';

export class CustomerMapper {
  static toDomain(record: PrismaUser): Customer {
    return new Customer(
      record.id,
      record.name,
      record.email,
      record.createdAt
    );
  }

  static toPersistence(customer: Customer): Omit<PrismaUser, 'id' | 'createdAt'> & { id?: number } {
    return {
      ...(customer.id ? { id: customer.id } : {}),
      name: customer.name,
      email: customer.email,
      passwordHash: '',
      role: 'PATIENT',
      passwordResetToken: null,
      passwordResetExpiresAt: null,
      phone: null,
    };
  }
}

