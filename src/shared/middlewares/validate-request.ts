import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { type ZodSchema, ZodError } from 'zod';
import { ApplicationError } from '../errors/applicationError.js';

export function validate(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as { body?: unknown; query?: unknown; params?: unknown };

      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query as typeof req.query;
      if (parsed.params) req.params = parsed.params as typeof req.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        }));
        next(new ApplicationError('VALIDATION_ERROR', 'Invalid request data', 'VALIDATION', issues));
        return;
      }
      next(error);
    }
  };
}

export default validate;
