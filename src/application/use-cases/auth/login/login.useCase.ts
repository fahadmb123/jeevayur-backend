import crypto from 'crypto';
import type { IUseCase } from '../../../../shared/interfaces/use-cases/IUseCase.js';
import type { IUserRepository } from '../../../../domain/repositories/auth/user.repository.js';
import type { ISessionRepository } from '../../../../domain/repositories/auth/session.repository.js';
import type { IPasswordHasher } from '../../../../shared/interfaces/services/IPasswordHasher.service.js';
import type { IJwtService } from '../../../../shared/interfaces/services/IJwtService.js';
import type { IEmailService } from '../../../../shared/interfaces/services/IEmailService.js';
import { ApplicationError } from '../../../../shared/errors/applicationError.js';
import { Logger } from '../../../../shared/logging/Logger.js';
import type { LoginRequestDto } from '../../../dtos/request/auth/login/login.dto.js';
import type { LoginResponseDto } from '../../../dtos/response/auth/login/login.dto.js';

export class LoginUseCase implements IUseCase<LoginRequestDto, LoginResponseDto> {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _jwtService: IJwtService,
    private readonly _sessionRepository?: ISessionRepository,
    private readonly _emailService?: IEmailService,
    private readonly _frontendUrl?: string
  ) {}

  async execute(input: LoginRequestDto): Promise<LoginResponseDto> {
    const email = input.email.trim().toLowerCase();
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new ApplicationError('USER_NOT_FOUND', 'Invalid email or password', 'AUTHENTICATION');
    }

    const isValid = await this._passwordHasher.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new ApplicationError('INVALID_CREDENTIALS', 'Invalid email or password', 'AUTHENTICATION');
    }

    const tokenPayload = { userId: user.id, role: user.role };
    const accessToken = await Promise.resolve(this._jwtService.generate(tokenPayload));
    const refreshToken = await Promise.resolve(this._jwtService.generateRefreshToken(tokenPayload));

    if (this._sessionRepository) {
      if (input.oldTokenHash) {
        await this._sessionRepository.deleteByTokenHash(input.oldTokenHash);
      }

      const existingSessions = await this._sessionRepository.findByUserId(user.id);
      const targetDevice = input.device || 'Unknown Device';
      const duplicateSessions = existingSessions.filter((s) => s.device === targetDevice);
      for (const s of duplicateSessions) {
        await this._sessionRepository.deleteById(s.id);
      }

      const remainingSessions = existingSessions.filter((s) => s.device !== targetDevice);
      if (remainingSessions.length >= 5) {
        const sorted = [...remainingSessions].sort(
          (a, b) => new Date(a.lastActiveAt).getTime() - new Date(b.lastActiveAt).getTime()
        );
        const excess = sorted.slice(0, remainingSessions.length - 4);
        for (const s of excess) {
          await this._sessionRepository.deleteById(s.id);
        }
      }

      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await this._sessionRepository.create({
        userId: user.id,
        tokenHash,
        ipAddress: input.ipAddress || '127.0.0.1',
        device: targetDevice,
        city: input.city ?? null,
        country: input.country ?? null,
      });
    }

    if (this._emailService && this._frontendUrl) {
      const manageSessionsUrl = `${this._frontendUrl}/doctor/settings`;
      this._emailService
        .sendNewLoginAlertEmail({
          toEmail: user.email,
          recipientName: user.name,
          device: input.device || 'Unknown Device',
          ipAddress: input.ipAddress || '127.0.0.1',
          city: input.city ?? null,
          country: input.country ?? null,
          loginTime: new Date(),
          manageSessionsUrl,
        })
        .catch((err) => {
          Logger.error(`[LoginUseCase] Failed to send new login notification email: ${err}`);
        });
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
      rememberMe: Boolean(input.rememberMe),
    };
  }
}
