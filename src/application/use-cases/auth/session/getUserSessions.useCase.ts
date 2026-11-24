import type { IUseCase } from '../../../../shared/interfaces/use-cases/IUseCase.js';
import type { ISessionRepository } from '../../../../domain/repositories/auth/session.repository.js';
import { hashSha256 } from '../../../../shared/utils/crypto.js';

export interface SessionItemDto {
  id: string;
  ipAddress: string;
  device: string | null;
  city: string | null;
  country: string | null;
  lastActiveAt: Date;
  createdAt: Date;
  isCurrent: boolean;
}

export interface GetUserSessionsInput {
  userId: number;
  refreshToken?: string;
  currentDevice?: string;
}

export interface GetUserSessionsResponseDto {
  sessions: SessionItemDto[];
}

export class GetUserSessionsUseCase implements IUseCase<GetUserSessionsInput, GetUserSessionsResponseDto> {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(input: GetUserSessionsInput): Promise<GetUserSessionsResponseDto> {
    const currentTokenHash = input.refreshToken ? hashSha256(input.refreshToken) : null;
    const allSessions = await this.sessionRepository.findByUserId(input.userId);

    const seenDevices = new Set<string>();
    const deduplicated: typeof allSessions = [];

    for (const s of allSessions) {
      const isCurrent = currentTokenHash
        ? s.tokenHash === currentTokenHash
        : s.device === input.currentDevice;
      if (isCurrent) {
        deduplicated.push(s);
        seenDevices.add(s.device || 'Unknown Device');
      }
    }

    for (const s of allSessions) {
      const isCurrent = currentTokenHash
        ? s.tokenHash === currentTokenHash
        : s.device === input.currentDevice;
      if (isCurrent) continue;

      const deviceKey = s.device || 'Unknown Device';
      if (seenDevices.has(deviceKey)) {
        await this.sessionRepository.deleteById(s.id);
      } else {
        seenDevices.add(deviceKey);
        deduplicated.push(s);
      }
    }

    const mappedSessions: SessionItemDto[] = deduplicated.map((s) => {
      const isCurrent = currentTokenHash
        ? s.tokenHash === currentTokenHash
        : s.device === input.currentDevice;

      return {
        id: s.id,
        ipAddress: s.ipAddress,
        device: s.device,
        city: s.city,
        country: s.country,
        lastActiveAt: s.lastActiveAt,
        createdAt: s.createdAt,
        isCurrent: Boolean(isCurrent),
      };
    });

    mappedSessions.sort((a, b) => {
      if (a.isCurrent) return -1;
      if (b.isCurrent) return 1;
      return new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime();
    });

    return {
      sessions: mappedSessions,
    };
  }
}
