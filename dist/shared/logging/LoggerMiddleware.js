import { Logger } from './Logger.js';
export class LoggerMiddleware {
    static handle(req, res, next) {
        const start = Date.now();
        res.on('finish', () => {
            Logger.http(req.method, req.originalUrl, res.statusCode, Date.now() - start);
        });
        next();
    }
}
