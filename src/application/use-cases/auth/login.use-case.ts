import { AppError } from '../../../shared/errors/app.error.js';
import { StatusMessage } from '../../../shared/errors/status.mapper.js';
import type { LoginResultDTO } from '../../dtos/auth/loginResult.dto.js';
import type { IUserRepository } from '../../../domain/repositories/user.repository.js';
import type { IPasswordService } from '../../interfaces/services/IPasswordService.js';
import type { ITokenService } from '../../interfaces/services/ITokenService.js';
import type { ILoginUseCase, LoginInput } from '../../interfaces/use-cases/auth/ILoginUseCase.js';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper.js';

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly passwords: IPasswordService,
    private readonly tokens: ITokenService,
  ) {}

  public async execute(input: LoginInput): Promise<LoginResultDTO> {
    const email = input.email.trim().toLowerCase();
    const user = await this.users.findByEmail(email);

    if (!user || !(await this.passwords.compare(input.password, user.passwordHash))) {
      throw new AppError(StatusMessage.UNAUTHORIZED, 'Invalid email or password');
    }

    const tokenPayload = { userId: user.id, role: user.role };
    const accessToken = await this.tokens.signAccessToken(tokenPayload);
    const refreshToken = await this.tokens.signRefreshToken(tokenPayload);

    return {
      user: UserMapper.toAuthenticatedUser(user),
      accessToken,
      refreshToken,
      rememberMe: input.rememberMe ?? false,
    };
  }
}
