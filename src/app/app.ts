import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import type { EnvironmentConfig } from '../config/environment.config.js';
import { notFoundHandler } from '../shared/middlewares/not-found.js';
import { errorHandler } from '../shared/middlewares/error-handler.js';
import { Logger } from '../shared/logging/Logger.js';
import { createRootRouter } from './routes.js';
import type { RootRouterDependencies } from './types/root-router-dependencies.js';

export function createApp(
  config: EnvironmentConfig,
  routeDependencies: RootRouterDependencies
): Application {
  const app = express();

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

  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      Logger.http(req.method, req.originalUrl, res.statusCode, duration);
    });
    next();
  });

  if (routeDependencies.healthRoutes) {
    app.use('/health', routeDependencies.healthRoutes);
  }

  const rootRouter = createRootRouter(routeDependencies);
  app.use('/api', rootRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
