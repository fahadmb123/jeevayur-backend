import { BaseController } from '../../shared/controllers/BaseController.js';
export class RootController extends BaseController {
    config;
    constructor(config) {
        super();
        this.config = config;
    }
    getRoot = (_req, res) => {
        this.sendOk(res, {
            message: 'Welcome to Jeevayurniketan Ayurveda & Psychotherapy API',
            status: 'online',
            port: this.config.port,
            apiDocs: '/api',
            healthCheck: '/health',
        });
    };
    getApiIndex = (_req, res) => {
        this.sendOk(res, {
            name: 'Jeevayurniketan API',
            version: '1.0.0',
            description: 'Ayurveda & Psychotherapy Clinical Services Backend',
            endpoints: {
                health: '/api/health',
                doctor: '/api/doctor',
            },
        });
    };
}
