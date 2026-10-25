import { AppError } from '../../../shared/errors/AppError.js';
import type { LoginResultDTO } from '../../dtos/auth/LoginResultDTO.js';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import type { IPasswordService } from '../../interfaces/services/IPasswordService.js';
import type { ITokenService } from '../../interfaces/services/ITokenService.js';
import type { ILoginUseCase, LoginInput } from '../../interfaces/use-cases/auth/ILoginUseCase.js';
import { UserMapper } from '../../../infrastructure/mappers/UserMapper.js';

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
      throw new AppError('Invalid email or password', 401);
    }

    return {
      user: UserMapper.toAuthenticatedUser(user),
      accessToken: await this.tokens.sign({ sub: user.id, role: user.role }),
      rememberMe: input.rememberMe ?? false,
    };
  }
}
