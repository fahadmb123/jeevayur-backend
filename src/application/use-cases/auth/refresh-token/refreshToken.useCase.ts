import crypto from 'crypto';
import type { IUseCase } from '../../../../shared/interfaces/use-cases/IUseCase.js';
import type { IUserRepository } from '../../../../domain/repositories/auth/user.repository.js';
import type { ISessionRepository } from '../../../../domain/repositories/auth/session.repository.js';
import type { IJwtService } from '../../../../shared/interfaces/services/IJwtService.js';
import { ApplicationError } from '../../../../shared/errors/applicationError.js';
import type { RefreshTokenRequestDto } from '../../../dtos/request/auth/refresh-token/refreshToken.dto.js';
import type { RefreshTokenResponseDto } from '../../../dtos/response/auth/refresh-token/refreshToken.dto.js';
import type { UserRole } from '../../../../domain/entities/auth/user.entity.js';

export class RefreshTokenUseCase implements IUseCase<RefreshTokenRequestDto, RefreshTokenResponseDto> {
  constructor(
    private readonly _jwtService: IJwtService,
    private readonly _userRepository?: IUserRepository,
    private readonly _sessionRepository?: ISessionRepository
  ) {}

  async execute(input: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    if (!input.refreshToken) {
      throw new ApplicationError('TOKEN_REQUIRED', 'Refresh token required', 'AUTHENTICATION');
    }

    const payload = this._jwtService.verifyRefreshToken(input.refreshToken);
    const tokenHash = crypto.createHash('sha256').update(input.refreshToken).digest('hex');

    let activeSession = null;
    if (this._sessionRepository) {
      activeSession = await this._sessionRepository.findByTokenHash(tokenHash);
      if (!activeSession) {
        throw new ApplicationError('SESSION_EXPIRED', 'Session has expired or was revoked', 'AUTHENTICATION');
      }
    }

    let userResponse = {
      id: payload.userId,
      email: '',
      name: '',
      role: payload.role as UserRole,
    };

    if (this._userRepository) {
      const existingUser = await this._userRepository.findById(payload.userId);
      if (!existingUser) {
        throw new ApplicationError('USER_NOT_FOUND', 'User no longer exists', 'AUTHENTICATION');
      }
      userResponse = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      };
    }

    const tokenPayload = { userId: payload.userId, role: payload.role };
    const accessToken = await Promise.resolve(this._jwtService.generate(tokenPayload));
    const refreshToken = await Promise.resolve(this._jwtService.generateRefreshToken(tokenPayload));

    if (this._sessionRepository && activeSession) {
      const newRefreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await this._sessionRepository.updateTokenHash(activeSession.id, newRefreshTokenHash);
    }

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }
}
