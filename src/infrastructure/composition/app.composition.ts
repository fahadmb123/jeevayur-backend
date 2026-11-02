import { EnvironmentConfig, env } from '../../config/environment.config.js';
import { ErrorMiddleware } from '../../shared/middlewares/error.middleware.js';
import type { RootRouterDependencies } from '../../types/root-router-dependencies.js';
import { buildRepositories, type RepositoriesComposition } from './repositories.composition.js';
import { buildServices, type ServicesComposition } from './services.composition.js';
import { buildUseCases, type UseCasesComposition } from './useCases.composition.js';
import { buildControllers, type ControllersComposition } from './controllers.composition.js';
import { buildRoutes, type RoutesComposition } from './routes.composition.js';

export interface AppCompositionRoot {
  repositories: RepositoriesComposition;
  services: ServicesComposition;
  useCases: UseCasesComposition;
  controllers: ControllersComposition;
  routes: RoutesComposition;
  routeDependencies: RootRouterDependencies;
  errorMiddleware: ErrorMiddleware;
}

export function buildComposition(config: EnvironmentConfig = env): AppCompositionRoot {
  const repositories = buildRepositories();
  const services = buildServices(config);
  const useCases = buildUseCases(repositories, services);
  const controllers = buildControllers(useCases, repositories, services);
  const routes = buildRoutes(controllers, services, config);
  const errorMiddleware = new ErrorMiddleware(config);

  return {
    repositories,
    services,
    useCases,
    controllers,
    routes,
    routeDependencies: routes.routeDependencies,
    errorMiddleware,
  };
}
