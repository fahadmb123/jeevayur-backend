import type { IUseCase } from '../../../../shared/interfaces/use-cases/IUseCase.js';
import type { ISessionRepository } from '../../../../domain/repositories/auth/session.repository.js';
import { ApplicationError } from '../../../../shared/errors/applicationError.js';

export interface RevokeSessionInput {
  userId: number;
  sessionId: string;
}

export class RevokeSessionUseCase implements IUseCase<RevokeSessionInput, void> {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(input: RevokeSessionInput): Promise<void> {
    if (!input.sessionId || typeof input.sessionId !== 'string') {
      throw new ApplicationError('VALIDATION_ERROR', 'Session ID is required', 'VALIDATION');
    }

    const session = await this.sessionRepository.findById(input.sessionId);
    if (session && session.userId === input.userId) {
      await this.sessionRepository.deleteById(input.sessionId);
    }
  }
}
