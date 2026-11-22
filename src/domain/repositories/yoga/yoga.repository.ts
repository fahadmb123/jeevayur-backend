import type { YogaSession } from '../../entities/yoga/yogaSession.entity.js';

export interface IYogaRepository {
  findAll(format?: string, search?: string): Promise<YogaSession[]>;
  findById(id: string): Promise<YogaSession | null>;
  create(session: YogaSession): Promise<YogaSession>;
  update(session: YogaSession): Promise<YogaSession>;
  delete(id: string): Promise<void>;
}
