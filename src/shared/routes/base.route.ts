import { Router } from 'express';
import type { IRoute } from './route.interface.js';

export abstract class BaseRoute implements IRoute {
  public readonly router: Router = Router();

  constructor(public readonly path: string) {}

  protected abstract initializeRoutes(): void;
}
