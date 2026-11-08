import crypto from 'crypto';
import type { IUseCase } from '../../../../shared/interfaces/use-cases/IUseCase.js';
import type { IUserRepository } from '../../../../domain/repositories/auth/user.repository.js';
import type { VerifyResetTokenRequestDto } from '../../../dtos/request/auth/verify-reset-token/verifyResetToken.dto.js';
import type { VerifyResetTokenResponseDto } from '../../../dtos/response/auth/verify-reset-token/verifyResetToken.dto.js';

export class VerifyResetTokenUseCase
  implements IUseCase<VerifyResetTokenRequestDto, VerifyResetTokenResponseDto>
{
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(input: VerifyResetTokenRequestDto): Promise<VerifyResetTokenResponseDto> {
    const rawToken = (input.token || '').trim();
    if (!rawToken) {
      return {
        valid: false,
        message: 'Password reset token is required. Please use the exact link sent to your email.',
      };
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const user = await this._userRepository.findByPasswordResetToken(tokenHash);

    if (
      !user ||
      !user.passwordResetExpiresAt ||
      new Date(user.passwordResetExpiresAt).getTime() < Date.now()
    ) {
      return {
        valid: false,
        message: 'This password reset link has expired or has already been used. Please request a new one.',
      };
    }

    let maskedEmail: string | undefined;
    if (user.email) {
      const [local, domain] = user.email.split('@');
      if (domain) {
        const visible = local.length <= 2 ? local[0] : `${local[0]}***${local[local.length - 1]}`;
        maskedEmail = `${visible}@${domain}`;
      }
    }

    return {
      valid: true,
      email: maskedEmail,
      message: 'Reset link is valid and active.',
    };
  }
}
