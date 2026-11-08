import type { IUseCase } from '../../../../shared/interfaces/use-cases/IUseCase.js';
import type { IUserRepository } from '../../../../domain/repositories/auth/user.repository.js';
import { UserMapper } from '../../../../infrastructure/mappers/auth/user.mapper.js';
import { ApplicationError } from '../../../../shared/errors/applicationError.js';
import type { UpdateProfileInputDto } from '../../../dtos/request/auth/profile/updateProfile.dto.js';
import type { UpdateProfileOutputDto } from '../../../dtos/response/auth/profile/updateProfile.dto.js';

export class UpdateProfileUseCase implements IUseCase<UpdateProfileInputDto, UpdateProfileOutputDto> {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(input: UpdateProfileInputDto): Promise<UpdateProfileOutputDto> {
    if (!input.userId || typeof input.userId !== 'number' || input.userId <= 0) {
      throw new ApplicationError(
        'UNAUTHORIZED',
        'Authentication is required to update profile',
        'AUTHENTICATION'
      );
    }

    const cleanData: { name?: string; email?: string; phone?: string | null } = {};

    // Validate Name
    if (input.name !== undefined) {
      const trimmedName = input.name.trim();
      if (trimmedName.length === 0) {
        throw new ApplicationError(
          'VALIDATION_ERROR',
          'Name is required and cannot be empty',
          'VALIDATION'
        );
      }
      if (trimmedName.length < 2 || trimmedName.length > 100) {
        throw new ApplicationError(
          'VALIDATION_ERROR',
          'Name must be between 2 and 100 characters',
          'VALIDATION'
        );
      }
      cleanData.name = trimmedName;
    }

    // Validate Email
    if (input.email !== undefined) {
      const trimmedEmail = input.email.trim().toLowerCase();
      if (trimmedEmail.length === 0) {
        throw new ApplicationError(
          'VALIDATION_ERROR',
          'Email address is required and cannot be empty',
          'VALIDATION'
        );
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        throw new ApplicationError(
          'VALIDATION_ERROR',
          'Please provide a valid email address',
          'VALIDATION'
        );
      }

      // Check unique email across other users
      const existingUserWithEmail = await this._userRepository.findByEmail(trimmedEmail);
      if (existingUserWithEmail && existingUserWithEmail.id !== input.userId) {
        throw new ApplicationError(
          'EMAIL_ALREADY_IN_USE',
          'This email is already associated with another account',
          'CONFLICT'
        );
      }
      cleanData.email = trimmedEmail;
    }

    // Validate Phone
    if (input.phone !== undefined) {
      if (input.phone === null) {
        cleanData.phone = null;
      } else {
        const trimmedPhone = input.phone.trim();
        if (trimmedPhone.length > 0) {
          const digitsOnly = trimmedPhone.replace(/[\s\-\+\(\)]/g, '');
          if (digitsOnly.length < 6 || digitsOnly.length > 15) {
            throw new ApplicationError(
              'VALIDATION_ERROR',
              'Please provide a valid phone number (6 to 15 digits)',
              'VALIDATION'
            );
          }
          cleanData.phone = trimmedPhone;
        } else {
          cleanData.phone = null;
        }
      }
    }

    // Ensure target user exists
    const user = await this._userRepository.findById(input.userId);
    if (!user) {
      throw new ApplicationError(
        'USER_NOT_FOUND',
        'User record not found',
        'NOT_FOUND'
      );
    }

    const updatedUser = await this._userRepository.updateProfile(input.userId, cleanData);

    return {
      user: UserMapper.toDto(updatedUser),
    };
  }
}
