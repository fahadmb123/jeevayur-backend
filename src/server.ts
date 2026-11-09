import 'reflect-metadata';
import http from 'http';
import { env, type EnvironmentConfig } from './config/environment.config.js';
import { db } from './shared/database/client.js';
import { Logger } from './shared/logging/Logger.js';
import { createApp } from './app/app.js';
import { setupContainer, TOKENS } from './infrastructure/di/index.js';
import { buildAuthRoutes } from './presentation/routes/auth/auth.routes.js';
import { buildDoctorRoutes } from './presentation/routes/doctor/doctor.routes.js';
import { buildHealthRoutes } from './presentation/routes/health/health.routes.js';
import { buildSocialLinkRoutes } from './presentation/routes/social/socialLink.routes.js';
import { buildAppointmentRoutes } from './presentation/routes/appointment/appointment.routes.js';
import { buildPatientRoutes } from './presentation/routes/patient/patient.routes.js';
import { AuthController } from './presentation/controllers/auth/auth.controller.js';
import { DoctorController } from './presentation/controllers/doctor/doctor.controller.js';
import { HealthController } from './presentation/controllers/health/health.controller.js';
import { SocialLinkController } from './presentation/controllers/social/socialLink.controller.js';
import { AppointmentController } from './presentation/controllers/appointment/appointment.controller.js';
import { PatientController } from './presentation/controllers/patient/patient.controller.js';
import { createAuthMiddleware } from './shared/middlewares/auth.middleware.js';
import type { JwtTokenService } from './infrastructure/services/auth/jwtToken.service.js';
import type { ISessionRepository } from './domain/repositories/auth/session.repository.js';

export class Server {
  private readonly httpServer: http.Server;

  constructor(private readonly config: EnvironmentConfig = env) {
    const di = setupContainer(this.config);

    const jwtService = di.resolve<JwtTokenService>(TOKENS.JwtService);
    const sessionRepository = di.resolve<ISessionRepository>(TOKENS.SessionRepository);

    const authMiddleware = createAuthMiddleware(
      jwtService,
      this.config.authCookieName,
      sessionRepository,
      this.config.refreshCookieName
    );

    const authController = di.resolve(AuthController);
    const doctorController = di.resolve(DoctorController);
    const healthController = di.resolve(HealthController);
    const socialLinkController = di.resolve(SocialLinkController);
    const appointmentController = di.resolve(AppointmentController);
    const patientController = di.resolve(PatientController);

    const authRoutes = buildAuthRoutes({ authController, authMiddleware });
    const doctorRoutes = buildDoctorRoutes({ doctorController, authMiddleware });
    const healthRoutes = buildHealthRoutes({ healthController });
    const socialLinkRoutes = buildSocialLinkRoutes({ socialLinkController, authMiddleware });
    const appointmentRoutes = buildAppointmentRoutes({ appointmentController, authMiddleware });
    const patientRoutes = buildPatientRoutes({ patientController, authMiddleware });

    const app = createApp(this.config, {
      authRoutes,
      doctorRoutes,
      healthRoutes,
      socialLinkRoutes,
      appointmentRoutes,
      patientRoutes,
    });

    this.httpServer = http.createServer(app);
    this.setupProcessSignals();
  }

  public async start(): Promise<void> {
    this.httpServer.listen(this.config.port, () => {
      Logger.info(`Jeevayurniketan backend running on http://localhost:${this.config.port}`);
      Logger.info(`Health endpoint: http://localhost:${this.config.port}/health`);
      Logger.info(`API endpoint: http://localhost:${this.config.port}/api`);
      Logger.info(`Environment: ${this.config.nodeEnv}`);
      Logger.info(`CORS origin: ${this.config.corsOrigin}`);
    });
  }

  public async stop(): Promise<void> {
    try {
      await db.$disconnect();
    } catch {
    }

    return new Promise((resolve, reject) => {
      this.httpServer.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  private setupProcessSignals(): void {
    const handleShutdown = (signal: string): void => {
      Logger.info(`[Server] Received ${signal}. Shutting down gracefully...`);
      this.stop()
        .then(() => {
          Logger.info('[Server] HTTP server closed cleanly.');
          process.exit(0);
        })
        .catch((error: Error) => {
          Logger.error('[Server] Error while shutting down:', error);
          process.exit(1);
        });

      setTimeout(() => {
        Logger.error('[Server] Forcefully shutting down due to timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  }
}

const server = new Server(env);
server.start();
