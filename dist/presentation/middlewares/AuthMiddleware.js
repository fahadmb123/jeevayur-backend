import { AppError } from '../../shared/errors/AppError.js';
export const createAuthMiddleware = (tokens, cookieName) => (req, _res, next) => {
    const token = req.cookies?.[cookieName];
    if (!token) {
        next(new AppError('Authentication required', 401));
        return;
    }
    try {
        req.auth = tokens.verify(token);
        next();
    }
    catch {
        next(new AppError('Authentication required', 401));
    }
};
