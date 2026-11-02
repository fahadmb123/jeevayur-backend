import type { IRefreshTokenUseCase } from '../../interfaces/use-cases/auth/IRefreshTokenUseCase.js';
import type { RefreshTokenRequestDTO } from '../../dtos/auth/refreshTokenRequest.dto.js';
import type { RefreshTokenResultDTO } from '../../dtos/auth/refreshTokenResult.dto.js';
import type { ITokenService } from '../../interfaces/services/ITokenService.js';
import type { IUserRepository } from '../../../domain/repositories/user.repository.js';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper.js';
import { AppError } from '../../../shared/errors/app.error.js';
import { StatusMessage } from '../../../shared/errors/status.mapper.js';

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly userRepository?: IUserRepository
  ) {}

  public async execute(input: RefreshTokenRequestDTO): Promise<RefreshTokenResultDTO> {
    if (!input.refreshToken) {
      throw new AppError(StatusMessage.UNAUTHORIZED, 'Refresh token required');
    }

    const payload = this.tokenService.verifyRefreshToken(input.refreshToken);

    let user = {
      id: payload.userId,
      email: '',
      name: '',
      role: payload.role,
    };

    if (this.userRepository) {
      const existingUser = await this.userRepository.findById(payload.userId);
      if (!existingUser) {
        throw new AppError(StatusMessage.UNAUTHORIZED, 'User no longer exists');
      }
      user = UserMapper.toAuthenticatedUser(existingUser);
    }

    const tokenPayload = {
      userId: payload.userId,
      role: payload.role,
    };

    const newAccessToken = await this.tokenService.signAccessToken(tokenPayload);
    const newRefreshToken = await this.tokenService.signRefreshToken(tokenPayload);

    return {
      user,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
