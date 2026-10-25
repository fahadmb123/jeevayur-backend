import { BaseRoute } from '../../shared/routes/BaseRoute.js';
import type { IRoute } from '../../shared/routes/IRoute.js';

export class ApiRoutes extends BaseRoute {
  constructor(private readonly subRoutes: IRoute[]) {
    super('/api');
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    for (const subRoute of this.subRoutes) {
      this.router.use(subRoute.path, subRoute.router);
    }
  }
}
