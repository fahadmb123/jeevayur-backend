import { Router } from 'express';
export class BaseRoute {
    path;
    router;
    constructor(path) {
        this.path = path;
        this.router = Router();
    }
}
