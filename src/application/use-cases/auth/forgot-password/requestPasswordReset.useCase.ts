import crypto from 'crypto';
import type { IUseCase } from '../../../../shared/interfaces/use-cases/IUseCase.js';
import type { IUserRepository } from '../../../../domain/repositories/auth/user.repository.js';
import type { IEmailService } from '../../../../shared/interfaces/services/IEmailService.js';
import type { ForgotPasswordRequestDto } from '../../../dtos/request/auth/forgot-password/forgotPassword.dto.js';

export interface RequestPasswordResetOutputDto {
  message: string;
}

export class RequestPasswordResetUseCase
  implements IUseCase<ForgotPasswordRequestDto, RequestPasswordResetOutputDto>
{
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _emailService: IEmailService,
    private readonly _frontendUrl: string
  ) {}

  async execute(input: ForgotPasswordRequestDto): Promise<RequestPasswordResetOutputDto> {
    const email = input.email.trim().toLowerCase();
    const user = await this._userRepository.findByEmail(email);

    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await this._userRepository.setPasswordResetToken(user.id, tokenHash, expiresAt);

      const resetUrl = `${this._frontendUrl}/reset-password?token=${rawToken}`;
      await this._emailService.sendPasswordResetEmail(user.email, resetUrl, user.name);
    }

    return {
      message: 'If an account exists with this email, password reset instructions have been sent.',
    };
  }
}

