import { AppError } from '../../../shared/errors/AppError.js';
import type { LoginResultDTO } from '../../dtos/auth/LoginResultDTO.js';
import type { LoginRequestDTO } from '../../dtos/auth/LoginRequestDTO.js';
import type { IUserRepository } from '../../interfaces/repositories/IUserRepository.js';
import type { IPasswordService } from '../../interfaces/services/IPasswordService.js';
import type { ITokenService } from '../../interfaces/services/ITokenService.js';
import { UserMapper } from '../../mappers/auth/UserMapper.js';

export class LoginUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly passwords: IPasswordService,
    private readonly tokens: ITokenService,
  ) {}

  public async execute(input: LoginRequestDTO & { rememberMe?: boolean }): Promise<LoginResultDTO> {
    const email = input.email.trim().toLowerCase();
    const user = await this.users.findByEmail(email);

    if (!user || !(await this.passwords.compare(input.password, user.passwordHash))) {
      throw new AppError('Invalid email or password', 401);
    }

    return {
      user: UserMapper.toAuthenticatedUser(user),
      accessToken: await this.tokens.sign({ sub: user.id, role: user.role }),
      rememberMe: input.rememberMe ?? false,
    };
  }
}
