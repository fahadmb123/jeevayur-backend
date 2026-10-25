import type { IBaseRepository } from './IBaseRepository.js';

export abstract class BaseRepository<TEntity> implements IBaseRepository<TEntity> {
  public abstract findById(id: number): Promise<TEntity | null>;
}
