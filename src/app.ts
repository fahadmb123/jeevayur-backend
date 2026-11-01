import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { EnvironmentConfig, env } from './config/environment.config.js';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware.js';
import { NotFoundMiddleware } from './shared/middlewares/notFound.middleware.js';
import { ErrorMiddleware } from './shared/middlewares/error.middleware.js';
import type { IRoute } from './shared/routes/route.interface.js';
import { buildComposition } from './infrastructure/composition/index.js';

export class App {
  public readonly app: Application;

  constructor(
    private readonly config: EnvironmentConfig,
    private readonly routes: IRoute[],
    private readonly errorMiddleware: ErrorMiddleware
  ) {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  public static create(config: EnvironmentConfig = env): App {
    const composition = buildComposition(config);
    return new App(config, composition.routes, composition.errorMiddleware);
  }

  private initializeMiddlewares(): void {
    this.app.use(
      cors({
        origin: this.config.corsOrigin === '*' ? '*' : this.config.corsOrigin.split(','),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(cookieParser());
    this.app.use(LoggerMiddleware.handle);
  }

  private initializeRoutes(): void {
    for (const route of this.routes) {
      this.app.use(route.path, route.router);
    }
  }

  private initializeErrorHandling(): void {
    this.app.use(NotFoundMiddleware.handle);
    this.app.use(this.errorMiddleware.handle);
  }
}
