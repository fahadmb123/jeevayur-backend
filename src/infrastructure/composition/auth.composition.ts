import type { Router } from 'express';
import type { EnvironmentConfig } from '../../config/environment.config.js';
import { PrismaUserRepository } from '../repositories/auth/prismaUser.repository.js';
import { ScryptPasswordService } from '../services/auth/scryptPassword.service.js';
import { JwtTokenService } from '../services/auth/jwtToken.service.js';
import { ExpressCookieService } from '../services/auth/expressCookie.service.js';
import { LoginUseCase } from '../../application/use-cases/auth/authentication/login.useCase.js';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/tokens/refreshToken.useCase.js';
import { AuthController } from '../../presentation/controllers/auth/auth.controller.js';
import { buildAuthRoutes } from '../../presentation/routes/auth/auth.routes.js';
import { createAuthMiddleware } from '../../shared/middlewares/auth.middleware.js';

export interface AuthComposition {
  userRepository: PrismaUserRepository;
  passwordHasher: ScryptPasswordService;
  jwtService: JwtTokenService;
  cookieService: ExpressCookieService;
  loginUseCase: LoginUseCase;
  refreshTokenUseCase: RefreshTokenUseCase;
  authController: AuthController;
  router: Router;
}

export function buildAuthComposition(config: EnvironmentConfig): AuthComposition {
  const userRepository = new PrismaUserRepository();
  const passwordHasher = new ScryptPasswordService();
  const jwtService = new JwtTokenService({
    accessTokenSecret: config.accessTokenSecret,
    refreshTokenSecret: config.refreshTokenSecret,
    accessTokenExpiresIn: config.accessTokenExpiresIn,
    refreshTokenExpiresIn: config.refreshTokenExpiresIn,
  });
  const cookieService = new ExpressCookieService(config);

  const loginUseCase = new LoginUseCase(userRepository, passwordHasher, jwtService);
  const refreshTokenUseCase = new RefreshTokenUseCase(jwtService, userRepository);

  const authController = new AuthController(
    loginUseCase,
    refreshTokenUseCase,
    cookieService,
    config,
    userRepository
  );

  const authMiddleware = createAuthMiddleware(jwtService, config.authCookieName);
  const router = buildAuthRoutes({
    authController,
    authMiddleware,
  });

  return {
    userRepository,
    passwordHasher,
    jwtService,
    cookieService,
    loginUseCase,
    refreshTokenUseCase,
    authController,
    router,
  };
}
