import { LoginUseCase } from '../../application/use-cases/auth/login.use-case.js';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case.js';
import type { RepositoriesComposition } from './repositories.composition.js';
import type { ServicesComposition } from './services.composition.js';

export interface UseCasesComposition {
  loginUseCase: LoginUseCase;
  refreshTokenUseCase: RefreshTokenUseCase;
}

export function buildUseCases(
  repositories: RepositoriesComposition,
  services: ServicesComposition
): UseCasesComposition {
  const loginUseCase = new LoginUseCase(
    repositories.userRepository,
    services.passwordService,
    services.tokenService
  );

  const refreshTokenUseCase = new RefreshTokenUseCase(
    services.tokenService,
    repositories.userRepository
  );

  return {
    loginUseCase,
    refreshTokenUseCase,
  };
}
