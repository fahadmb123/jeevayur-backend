import type { Router } from 'express';
import type { EnvironmentConfig } from '../../config/environment.config.js';
import { PrismaUserRepository } from '../repositories/auth/prismaUser.repository.js';
import { PrismaSessionRepository } from '../repositories/auth/prismaSession.repository.js';
import { ScryptPasswordService } from '../services/auth/scryptPassword.service.js';
import { JwtTokenService } from '../services/auth/jwtToken.service.js';
import { ExpressCookieService } from '../services/auth/expressCookie.service.js';
import { EmailService } from '../services/email/email.service.js';
import { LoginUseCase } from '../../application/use-cases/auth/authentication/login.useCase.js';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/tokens/refreshToken.useCase.js';
import { RequestPasswordResetUseCase } from '../../application/use-cases/auth/authentication/requestPasswordReset.useCase.js';
import { ResetPasswordUseCase } from '../../application/use-cases/auth/authentication/resetPassword.useCase.js';
import { AuthController } from '../../presentation/controllers/auth/auth.controller.js';
import { buildAuthRoutes } from '../../presentation/routes/auth/auth.routes.js';
import { createAuthMiddleware } from '../../shared/middlewares/auth.middleware.js';

export interface AuthComposition {
  userRepository: PrismaUserRepository;
  sessionRepository: PrismaSessionRepository;
  passwordHasher: ScryptPasswordService;
  jwtService: JwtTokenService;
  cookieService: ExpressCookieService;
  emailService: EmailService;
  loginUseCase: LoginUseCase;
  refreshTokenUseCase: RefreshTokenUseCase;
  requestPasswordResetUseCase: RequestPasswordResetUseCase;
  resetPasswordUseCase: ResetPasswordUseCase;
  authController: AuthController;
  router: Router;
}

export function buildAuthComposition(config: EnvironmentConfig): AuthComposition {
  const userRepository = new PrismaUserRepository();
  const sessionRepository = new PrismaSessionRepository();
  const passwordHasher = new ScryptPasswordService();
  const jwtService = new JwtTokenService({
    accessTokenSecret: config.accessTokenSecret,
    refreshTokenSecret: config.refreshTokenSecret,
    accessTokenExpiresIn: config.accessTokenExpiresIn,
    refreshTokenExpiresIn: config.refreshTokenExpiresIn,
  });
  const cookieService = new ExpressCookieService(config);
  const emailService = new EmailService(config);

  const loginUseCase = new LoginUseCase(userRepository, passwordHasher, jwtService, sessionRepository);
  const refreshTokenUseCase = new RefreshTokenUseCase(jwtService, userRepository, sessionRepository);
  const requestPasswordResetUseCase = new RequestPasswordResetUseCase(
    userRepository,
    emailService,
    config.frontendUrl
  );
  const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, passwordHasher);

  const authController = new AuthController(
    loginUseCase,
    refreshTokenUseCase,
    requestPasswordResetUseCase,
    resetPasswordUseCase,
    cookieService,
    config,
    userRepository,
    sessionRepository
  );

  const authMiddleware = createAuthMiddleware(jwtService, config.authCookieName);
  const router = buildAuthRoutes({
    authController,
    authMiddleware,
  });

  return {
    userRepository,
    sessionRepository,
    passwordHasher,
    jwtService,
    cookieService,
    emailService,
    loginUseCase,
    refreshTokenUseCase,
    requestPasswordResetUseCase,
    resetPasswordUseCase,
    authController,
    router,
  };
}
