import { AppError } from '../../shared/errors/AppError.js';
export const validateBody = (schema) => (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        next(new AppError('Request validation failed', 400, true, result.error.flatten().fieldErrors));
        return;
    }
    req.body = result.data;
    next();
};
