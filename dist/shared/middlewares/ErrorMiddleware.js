import { AppError } from '../errors/AppError.js';
import { Logger } from '../logging/Logger.js';
export class ErrorMiddleware {
    config;
    constructor(config) {
        this.config = config;
    }
    handle = (err, _req, res, _next) => {
        const statusCode = err instanceof AppError ? err.statusCode : 500;
        const message = err.message || 'Internal Server Error';
        Logger.error(`[Error] ${statusCode} - ${message}`);
        if (statusCode === 500 && err.stack) {
            Logger.error(err.stack);
        }
        res.status(statusCode).json({
            success: false,
            error: {
                message,
                statusCode,
                timestamp: new Date().toISOString(),
                ...(err instanceof AppError && err.details ? { details: err.details } : {}),
                ...(this.config.nodeEnv === 'development' && { stack: err.stack }),
            },
        });
    };
}
