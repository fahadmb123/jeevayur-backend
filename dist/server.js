import http from 'http';
import { App } from './app.js';
import { env } from './config/EnvironmentConfig.js';
import prisma from './infrastructure/database/prisma.js';
import { Logger } from './shared/logging/Logger.js';
export class Server {
    appInstance;
    config;
    httpServer;
    constructor(appInstance, config) {
        this.appInstance = appInstance;
        this.config = config;
        this.httpServer = http.createServer(this.appInstance.app);
        this.setupProcessSignals();
    }
    async start() {
        this.httpServer.listen(this.config.port, () => {
            Logger.info(`Jeevayurniketan backend running on http://localhost:${this.config.port}`);
            Logger.info(`Health endpoint: http://localhost:${this.config.port}/health`);
            Logger.info(`API endpoint: http://localhost:${this.config.port}/api`);
            Logger.info(`Environment: ${this.config.nodeEnv}`);
            Logger.info(`CORS origin: ${this.config.corsOrigin}`);
        });
    }
    async stop() {
        try {
            await prisma.$disconnect();
        }
        catch {
        }
        return new Promise((resolve, reject) => {
            this.httpServer.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
    setupProcessSignals() {
        const handleShutdown = (signal) => {
            Logger.info(`[Server] Received ${signal}. Shutting down gracefully...`);
            this.stop()
                .then(() => {
                Logger.info('[Server] HTTP server closed cleanly.');
                process.exit(0);
            })
                .catch((error) => {
                Logger.error('[Server] Error while shutting down:', error);
                process.exit(1);
            });
            setTimeout(() => {
                Logger.error('[Server] Forcefully shutting down due to timeout.');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => handleShutdown('SIGTERM'));
        process.on('SIGINT', () => handleShutdown('SIGINT'));
    }
}
const appInstance = App.create(env);
const server = new Server(appInstance, env);
server.start();
