import type { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../../shared/controllers/BaseController.js';
import type { LoginUseCase } from '../../../application/use-cases/auth/LoginUseCase.js';

export class DoctorController extends BaseController {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super();
  }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body as { email?: unknown; password?: unknown };
      if (typeof email !== 'string' || !email.trim()) {
        this.sendError(res, 'Email address is required', 400);
        return;
      }
      if (typeof password !== 'string' || !password) {
        this.sendError(res, 'Password is required', 400);
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
        this.sendError(res, 'Enter a valid email address', 400);
        return;
      }
      if (password.length < 8) {
        this.sendError(res, 'Password must be at least 8 characters', 400);
        return;
      }
      const result = await this.loginUseCase.execute({ email, password });
      this.sendOk(res, result);
    } catch (error) {
      next(error);
    }
  };
}
