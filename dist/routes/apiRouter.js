import { Router } from 'express';
import { healthRouter } from './healthRoutes.js';
export const apiRouter = Router();
apiRouter.use('/health', healthRouter);
apiRouter.get('/', (_req, res) => {
    res.status(200).json({
        name: 'Jeevayurniketan API',
        version: '1.0.0',
        description: 'Ayurveda & Psychotherapy Clinical Services Backend',
        endpoints: {
            health: '/api/health',
        },
    });
});
