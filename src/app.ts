import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { EnvironmentConfig, env } from './config/environment.config.js';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware.js';
import { NotFoundMiddleware } from './shared/middlewares/notFound.middleware.js';
import { ErrorMiddleware } from './shared/middlewares/error.middleware.js';
import { createRootRouter } from './routes.js';
import type { RootRouterDependencies } from './types/root-router-dependencies.js';
import { buildComposition } from './infrastructure/composition/index.js';

export function createApp(
  config: EnvironmentConfig,
  routeDependencies: RootRouterDependencies,
  errorMiddleware: ErrorMiddleware
): Application {
  const app = express();

  // Middlewares
  app.use(
    cors({
      origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(config.cookieSecret));
  app.use(LoggerMiddleware.handle);

  // Direct health check
  if (routeDependencies.healthRoutes) {
    app.use('/health', routeDependencies.healthRoutes);
  }

  // Root Router mounting
  const rootRouter = createRootRouter(routeDependencies);
  app.use('/api', rootRouter);

  // Not Found & Error Handling
  app.use(NotFoundMiddleware.handle);
  app.use(errorMiddleware.handle);

  return app;
}

export class App {
  public readonly app: Application;

  constructor(
    private readonly config: EnvironmentConfig,
    private readonly routeDependencies: RootRouterDependencies,
    private readonly errorMiddleware: ErrorMiddleware
  ) {
    this.app = createApp(this.config, this.routeDependencies, this.errorMiddleware);
  }

  public static create(config: EnvironmentConfig = env): App {
    const composition = buildComposition(config);
    return new App(config, composition.routeDependencies, composition.errorMiddleware);
  }
}
