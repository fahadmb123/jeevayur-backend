import { Router } from 'express';
import type { IRoute } from './IRoute.js';

export abstract class BaseRoute implements IRoute {
  public readonly router: Router;

  constructor(public readonly path: string) {
    this.router = Router();
  }

  protected abstract initializeRoutes(): void;
}
