import crypto from 'crypto';
import type { IUseCase } from '../../../../shared/interfaces/use-cases/IUseCase.js';
import type { IUserRepository } from '../../../../domain/repositories/auth/user.repository.js';
import type { IPasswordHasher } from '../../../../shared/interfaces/services/IPasswordHasher.service.js';
import { ApplicationError } from '../../../../shared/errors/applicationError.js';
import type { ResetPasswordRequestDto } from '../../../dtos/request/auth/reset-password/resetPassword.dto.js';

export interface ResetPasswordResponseDto {
  success: boolean;
  message: string;
}

export class ResetPasswordUseCase
  implements IUseCase<ResetPasswordRequestDto, ResetPasswordResponseDto>
{
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher
  ) {}

  async execute(input: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
    const rawToken = input.token.trim();
    if (!rawToken) {
      throw new ApplicationError(
        'INVALID_TOKEN',
        'Password reset token is required',
        'VALIDATION'
      );
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const user = await this._userRepository.findByPasswordResetToken(tokenHash);

    if (
      !user ||
      !user.passwordResetExpiresAt ||
      new Date(user.passwordResetExpiresAt).getTime() < Date.now()
    ) {
      throw new ApplicationError(
        'EXPIRED_OR_INVALID_TOKEN',
        'Password reset link is invalid or has expired. Please request a new one.',
        'VALIDATION'
      );
    }

    const newPasswordHash = await this._passwordHasher.hash(input.newPassword);
    await this._userRepository.updatePassword(user.id, newPasswordHash);

    return {
      success: true,
      message: 'Password has been updated successfully. You can now sign in.',
    };
  }
}

