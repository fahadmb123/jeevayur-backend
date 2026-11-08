import type { IUseCase } from '../../../../shared/interfaces/use-cases/IUseCase.js';
import type { IUserRepository } from '../../../../domain/repositories/auth/user.repository.js';
import { UserMapper } from '../../../../infrastructure/mappers/auth/user.mapper.js';
import { ApplicationError } from '../../../../shared/errors/applicationError.js';
import type { UpdateProfileRequestDto } from '../../../dtos/request/auth/profile/updateProfile.dto.js';
import type { UpdateProfileResponseDto } from '../../../dtos/response/auth/profile/updateProfile.dto.js';

export class UpdateProfileUseCase implements IUseCase<UpdateProfileRequestDto, UpdateProfileResponseDto> {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(input: UpdateProfileRequestDto): Promise<UpdateProfileResponseDto> {
    if (!input.userId || typeof input.userId !== 'number' || input.userId <= 0) {
      throw new ApplicationError(
        'UNAUTHORIZED',
        'Authentication is required to update profile',
        'AUTHENTICATION'
      );
    }

    const user = await this._userRepository.findById(input.userId);
    if (!user) {
      throw new ApplicationError(
        'USER_NOT_FOUND',
        'User record not found',
        'NOT_FOUND'
      );
    }

    if (input.email) {
      const existingUserWithEmail = await this._userRepository.findByEmail(input.email);
      if (existingUserWithEmail && existingUserWithEmail.id !== input.userId) {
        throw new ApplicationError(
          'EMAIL_ALREADY_IN_USE',
          'This email is already associated with another account',
          'CONFLICT'
        );
      }
    }

    const updatedUser = await this._userRepository.updateProfile(input.userId, {
      name: input.name,
      email: input.email,
      phone: input.phone,
    });

    return {
      user: UserMapper.toDto(updatedUser),
    };
  }
}
