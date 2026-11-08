import http from 'http';
import { env, type EnvironmentConfig } from './config/environment.config.js';
import { db } from './shared/database/client.js';
import { Logger } from './shared/logging/Logger.js';
import { createApp } from './app/app.js';
import { buildAuthComposition } from './infrastructure/composition/auth.composition.js';
import { buildDoctorComposition } from './infrastructure/composition/doctor.composition.js';
import { buildHealthComposition } from './infrastructure/composition/health.composition.js';
import { buildSocialLinkComposition } from './infrastructure/composition/socialLink.composition.js';
import { buildAppointmentComposition } from './infrastructure/composition/appointment.composition.js';
import { createAuthMiddleware } from './shared/middlewares/auth.middleware.js';

export class Server {
  private readonly httpServer: http.Server;

  constructor(private readonly config: EnvironmentConfig = env) {
    const authComposition = buildAuthComposition(this.config);
    const authMiddleware = createAuthMiddleware(
      authComposition.jwtService,
      this.config.authCookieName,
      authComposition.sessionRepository,
      this.config.refreshCookieName
    );
    const doctorComposition = buildDoctorComposition(authMiddleware);
    const healthComposition = buildHealthComposition();
    const socialLinkComposition = buildSocialLinkComposition(authMiddleware);
    const appointmentComposition = buildAppointmentComposition(this.config);

    const app = createApp(this.config, {
      authRoutes: authComposition.router,
      doctorRoutes: doctorComposition.router,
      healthRoutes: healthComposition.router,
      socialLinkRoutes: socialLinkComposition.router,
      appointmentRoutes: appointmentComposition.router,
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
