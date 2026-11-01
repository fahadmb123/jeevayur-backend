import type { AuthenticatedUserDTO } from '../../application/dtos/auth/authenticatedUser.dto.js';
import type { User } from '../../domain/entities/user.entity.js';

export const UserMapper = {
  toAuthenticatedUser(user: User): AuthenticatedUserDTO {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },
};

