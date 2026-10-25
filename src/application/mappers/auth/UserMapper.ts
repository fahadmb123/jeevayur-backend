import type { AuthenticatedUserDTO } from '../../dtos/auth/AuthenticatedUserDTO.js';
import type { User } from '../../../domain/entities/User.js';

export const UserMapper = {
  toAuthenticatedUser(user: User): AuthenticatedUserDTO {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },
};
