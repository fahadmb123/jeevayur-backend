import { EnvironmentConfig, env } from '../../config/environment.config.js';
import { PrismaUserRepository } from '../repositories/prismaUser.repository.js';
import { PrismaCustomerRepository } from '../repositories/prismaCustomer.repository.js';
import { ScryptPasswordService } from '../services/scryptPassword.service.js';
import { JwtTokenService } from '../services/jwtToken.service.js';
import { ExpressCookieService } from '../services/expressCookie.service.js';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case.js';
import { AuthController } from '../../presentation/controllers/auth/auth.controller.js';
import { DoctorController } from '../../presentation/controllers/doctor/doctor.controller.js';
import { HealthController } from '../../presentation/controllers/health.controller.js';
import { AuthRoutes } from '../../presentation/routes/auth/auth.routes.js';
import { DoctorRoutes } from '../../presentation/routes/doctor/doctor.routes.js';
import { HealthRoutes } from '../../presentation/routes/health.routes.js';
import { ApiRoutes } from '../../presentation/routes/api.routes.js';
import { ErrorMiddleware } from '../../shared/middlewares/error.middleware.js';
import type { RootRouterDependencies } from '../../types/root-router-dependencies.js';

export interface AppCompositionRoot {
  repositories: {
    userRepository: PrismaUserRepository;
    customerRepository: PrismaCustomerRepository;
  };
  services: {
    passwordService: ScryptPasswordService;
    tokenService: JwtTokenService;
    cookieService: ExpressCookieService;
  };
  useCases: {
    loginUseCase: LoginUseCase;
  };
  controllers: {
    authController: AuthController;
    doctorController: DoctorController;
    healthController: HealthController;
  };
  routeDependencies: RootRouterDependencies;
  routes: [HealthRoutes, ApiRoutes];
  errorMiddleware: ErrorMiddleware;
}

export function buildComposition(config: EnvironmentConfig = env): AppCompositionRoot {
  const userRepository = new PrismaUserRepository();
  const customerRepository = new PrismaCustomerRepository();

  const passwordService = new ScryptPasswordService();
  const tokenService = new JwtTokenService(config.tokenSecret);
  const cookieService = new ExpressCookieService(config);

  const loginUseCase = new LoginUseCase(userRepository, passwordService, tokenService);

  const authController = new AuthController(loginUseCase, cookieService, userRepository);
  const doctorController = new DoctorController(loginUseCase);
  const healthController = new HealthController();

  const healthRoutes = new HealthRoutes(healthController);
  const authRoutes = new AuthRoutes(authController, tokenService, config);
  const doctorRoutes = new DoctorRoutes(doctorController);
  const apiRoutes = new ApiRoutes([authRoutes, doctorRoutes, healthRoutes]);

  const routeDependencies: RootRouterDependencies = {
    authRoutes: authRoutes.router,
    doctorRoutes: doctorRoutes.router,
    healthRoutes: healthRoutes.router,
  };

  const errorMiddleware = new ErrorMiddleware(config);

  return {
    repositories: {
      userRepository,
      customerRepository,
    },
    services: {
      passwordService,
      tokenService,
      cookieService,
    },
    useCases: {
      loginUseCase,
    },
    controllers: {
      authController,
      doctorController,
      healthController,
    },
    routeDependencies,
    routes: [healthRoutes, apiRoutes],
    errorMiddleware,
  };
}
