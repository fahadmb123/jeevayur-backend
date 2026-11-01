import { EnvironmentConfig, env } from '../../config/EnvironmentConfig.js';
import { PrismaUserRepository } from '../repositories/prismaUser.repository.js';
import { PrismaCustomerRepository } from '../repositories/prismaCustomer.repository.js';
import { ScryptPasswordService } from '../services/ScryptPasswordService.js';
import { JwtTokenService } from '../services/JwtTokenService.js';
import { ExpressCookieService } from '../services/ExpressCookieService.js';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase.js';
import { AuthController } from '../../presentation/controllers/auth/AuthController.js';
import { DoctorController } from '../../presentation/controllers/doctor/DoctorController.js';
import { HealthController } from '../../presentation/controllers/HealthController.js';
import { AuthRoutes } from '../../presentation/routes/auth/AuthRoutes.js';
import { DoctorRoutes } from '../../presentation/routes/doctor/DoctorRoutes.js';
import { HealthRoutes } from '../../presentation/routes/HealthRoutes.js';
import { ApiRoutes } from '../../presentation/routes/ApiRoutes.js';
import { ErrorMiddleware } from '../../shared/middlewares/ErrorMiddleware.js';

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
  routes: [HealthRoutes, ApiRoutes];
  errorMiddleware: ErrorMiddleware;
}

export function buildComposition(config: EnvironmentConfig = env): AppCompositionRoot {
  // Repositories
  const userRepository = new PrismaUserRepository();
  const customerRepository = new PrismaCustomerRepository();

  // Services
  const passwordService = new ScryptPasswordService();
  const tokenService = new JwtTokenService(config.tokenSecret);
  const cookieService = new ExpressCookieService(config);

  // Use Cases
  const loginUseCase = new LoginUseCase(userRepository, passwordService, tokenService);

  // Controllers
  const authController = new AuthController(loginUseCase, cookieService, userRepository);
  const doctorController = new DoctorController(loginUseCase);
  const healthController = new HealthController();

  // Routes
  const healthRoutes = new HealthRoutes(healthController);
  const authRoutes = new AuthRoutes(authController, tokenService, config);
  const doctorRoutes = new DoctorRoutes(doctorController);
  const apiRoutes = new ApiRoutes([authRoutes, doctorRoutes, healthRoutes]);

  // Error middleware
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
    routes: [healthRoutes, apiRoutes],
    errorMiddleware,
  };
}

