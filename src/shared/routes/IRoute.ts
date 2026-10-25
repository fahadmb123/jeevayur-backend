import type { Router } from 'express';

export interface IRoute {
  readonly path: string;
  readonly router: Router;
}
