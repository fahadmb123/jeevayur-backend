import type { IUseCase } from '../../../../../shared/interfaces/use-cases/IUseCase.js';
import type { IUserRepository } from '../../../domain/repositories/user.repository.js';
import type { IPasswordHasher } from '../../../../../shared/interfaces/services/IPasswordHasher.service.js';
import type { IJwtService } from '../../../../../shared/interfaces/services/IJwtService.js';
import { ApplicationError } from '../../../../../shared/errors/applicationError.js';
import type { LoginInputDto } from '../../dtos/request/login.dto.js';
import type { LoginOutputDto } from '../../dtos/response/login.dto.js';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper.js';

export class LoginUseCase implements IUseCase<LoginInputDto, LoginOutputDto> {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _jwtService: IJwtService
  ) {}

  async execute(input: LoginInputDto): Promise<LoginOutputDto> {
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

    return {
      user: UserMapper.toDto(user),
      accessToken,
      refreshToken,
      rememberMe: Boolean(input.rememberMe),
    };
  }
}

