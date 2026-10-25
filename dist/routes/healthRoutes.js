import { Router } from 'express';
import { env } from '../config/environment.js';
export const healthRouter = Router();
healthRouter.get('/', (_req, res) => {
    const uptimeSeconds = Math.floor(process.uptime());
    res.status(200).json({
        status: 'healthy',
        uptime: `${uptimeSeconds}s`,
        timestamp: new Date().toISOString(),
        environment: env.nodeEnv,
        port: env.port,
        service: 'Jeevayurniketan Ayurveda API Server',
    });
});
