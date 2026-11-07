import { LoginUseCase } from '../../application/use-cases/authentication/login.useCase.js';
import { RefreshTokenUseCase } from '../../application/use-cases/tokens/refreshToken.useCase.js';
import type { AuthRepositoriesComposition } from './repositories.js';
import type { AuthServicesComposition } from './services.js';

export interface AuthUseCasesComposition {
  loginUseCase: LoginUseCase;
  refreshTokenUseCase: RefreshTokenUseCase;
}

export function buildAuthUseCases(
  repositories: AuthRepositoriesComposition,
  services: AuthServicesComposition
): AuthUseCasesComposition {
  return {
    loginUseCase: new LoginUseCase(
      repositories.userRepository,
      services.passwordHasher,
      services.jwtService
    ),
    refreshTokenUseCase: new RefreshTokenUseCase(
      services.jwtService,
      repositories.userRepository
    ),
  };
}
