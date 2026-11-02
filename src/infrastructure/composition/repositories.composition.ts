import { PrismaUserRepository } from '../repositories/prismaUser.repository.js';
import { PrismaCustomerRepository } from '../repositories/prismaCustomer.repository.js';

export interface RepositoriesComposition {
  userRepository: PrismaUserRepository;
  customerRepository: PrismaCustomerRepository;
}

export function buildRepositories(): RepositoriesComposition {
  const userRepository = new PrismaUserRepository();
  const customerRepository = new PrismaCustomerRepository();

  return {
    userRepository,
    customerRepository,
  };
}

