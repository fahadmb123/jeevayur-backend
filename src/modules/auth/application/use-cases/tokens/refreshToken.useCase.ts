import type { IUseCase } from '../../../../../shared/interfaces/use-cases/IUseCase.js';
import type { IUserRepository } from '../../../domain/repositories/user.repository.js';
import type { IJwtService } from '../../../../../shared/interfaces/services/IJwtService.js';
import { ApplicationError } from '../../../../../shared/errors/applicationError.js';
import type { RefreshTokenInputDto } from '../../dtos/request/refreshToken.dto.js';
import type { RefreshTokenOutputDto } from '../../dtos/response/refreshToken.dto.js';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper.js';
import type { UserRole } from '../../../domain/entities/user.entity.js';

export class RefreshTokenUseCase implements IUseCase<RefreshTokenInputDto, RefreshTokenOutputDto> {
  constructor(
    private readonly _jwtService: IJwtService,
    private readonly _userRepository?: IUserRepository
  ) {}

  async execute(input: RefreshTokenInputDto): Promise<RefreshTokenOutputDto> {
    if (!input.refreshToken) {
      throw new ApplicationError('TOKEN_REQUIRED', 'Refresh token required', 'AUTHENTICATION');
    }

    const payload = this._jwtService.verifyRefreshToken(input.refreshToken);

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
      userResponse = UserMapper.toDto(existingUser);
    }

    const tokenPayload = { userId: payload.userId, role: payload.role };
    const accessToken = await Promise.resolve(this._jwtService.generate(tokenPayload));
    const refreshToken = await Promise.resolve(this._jwtService.generateRefreshToken(tokenPayload));

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }
}

