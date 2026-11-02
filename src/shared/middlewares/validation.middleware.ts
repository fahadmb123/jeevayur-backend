import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../errors/app.error.js';
import { StatusMessage } from '../errors/status.mapper.js';

export interface RequestValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export const validateBody = (schema: ZodType) => (req: Request, _res: Response, next: NextFunction): void => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues[0]?.message || 'Request validation failed';
    next(new AppError(StatusMessage.BAD_REQUEST, message, result.error.flatten().fieldErrors));
    return;
  }
  req.body = result.data;
  next();
};

export const validateQuery = (schema: ZodType) => (req: Request, _res: Response, next: NextFunction): void => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues[0]?.message || 'Query validation failed';
    next(new AppError(StatusMessage.BAD_REQUEST, message, result.error.flatten().fieldErrors));
    return;
  }
  req.query = result.data as unknown as Request['query'];
  next();
};

export const validateParams = (schema: ZodType) => (req: Request, _res: Response, next: NextFunction): void => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    const message = result.error.issues[0]?.message || 'Route parameters validation failed';
    next(new AppError(StatusMessage.BAD_REQUEST, message, result.error.flatten().fieldErrors));
    return;
  }
  req.params = result.data as unknown as Request['params'];
  next();
};

export const validateRequest = (schemas: RequestValidationSchemas) => (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (schemas.params) {
    const result = schemas.params.safeParse(req.params);
    if (!result.success) {
      const message = result.error.issues[0]?.message || 'Route parameters validation failed';
      next(new AppError(StatusMessage.BAD_REQUEST, message, result.error.flatten().fieldErrors));
      return;
    }
    req.params = result.data as unknown as Request['params'];
  }

  if (schemas.query) {
    const result = schemas.query.safeParse(req.query);
    if (!result.success) {
      const message = result.error.issues[0]?.message || 'Query validation failed';
      next(new AppError(StatusMessage.BAD_REQUEST, message, result.error.flatten().fieldErrors));
      return;
    }
    req.query = result.data as unknown as Request['query'];
  }

  if (schemas.body) {
    const result = schemas.body.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues[0]?.message || 'Request validation failed';
      next(new AppError(StatusMessage.BAD_REQUEST, message, result.error.flatten().fieldErrors));
      return;
    }
    req.body = result.data;
  }

  next();
};
