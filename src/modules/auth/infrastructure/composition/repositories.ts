import { PrismaUserRepository } from '../repositories/prismaUser.repository.js';
import type { IUserRepository } from '../../domain/repositories/user.repository.js';

export interface AuthRepositoriesComposition {
  userRepository: IUserRepository;
}

export function buildAuthRepositories(): AuthRepositoriesComposition {
  return {
    userRepository: new PrismaUserRepository(),
  };
}
