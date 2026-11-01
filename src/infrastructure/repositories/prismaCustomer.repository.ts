import type { ICustomerRepository } from '../../domain/repositories/ICustomerRepository.js';
import { BaseRepository } from '../../shared/repositories/BaseRepository.js';
import type { Customer } from '../../domain/entities/Customer.js';
import prisma from '../database/prisma.js';

export class PrismaCustomerRepository extends BaseRepository<Customer> implements ICustomerRepository {
  public async findById(id: number): Promise<Customer | null> {
    const user = await prisma.user.findFirst({
      where: { id, role: 'PATIENT' },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  public async findByEmail(email: string): Promise<Customer | null> {
    const user = await prisma.user.findFirst({
      where: { email, role: 'PATIENT' },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  public async findAll(): Promise<Customer[]> {
    const users = await prisma.user.findMany({
      where: { role: 'PATIENT' },
      orderBy: { createdAt: 'desc' },
    });
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }));
  }
}
