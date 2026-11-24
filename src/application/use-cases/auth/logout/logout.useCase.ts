import type { IUseCase } from '../../../../shared/interfaces/use-cases/IUseCase.js';
import type { ISessionRepository } from '../../../../domain/repositories/auth/session.repository.js';
import { hashSha256 } from '../../../../shared/utils/crypto.js';

export interface LogoutInput {
  refreshToken?: string;
}

export class LogoutUseCase implements IUseCase<LogoutInput, void> {
  constructor(private readonly sessionRepository?: ISessionRepository) {}

  async execute(input: LogoutInput): Promise<void> {
    if (input.refreshToken && this.sessionRepository) {
      const tokenHash = hashSha256(input.refreshToken);
      await this.sessionRepository.deleteByTokenHash(tokenHash);
    }
  }
}
