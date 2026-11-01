import type { Request, Response } from 'express';

export class NotFoundMiddleware {
  public static handle = (req: Request, res: Response): void => {
    res.status(404).json({
      success: false,
      error: {
        message: `Route ${req.method} ${req.originalUrl} not found`,
        statusCode: 404,
        timestamp: new Date().toISOString(),
      },
    });
  };
}

