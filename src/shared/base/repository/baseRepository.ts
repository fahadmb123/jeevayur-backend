export interface IBaseRepository<T, ID = string | number> {
  findById(id: ID): Promise<T | null>;
  findAll?(): Promise<T[]>;
  create?(data: unknown): Promise<T>;
  delete?(id: ID): Promise<void | boolean>;
}

export type BaseRepository<T> = IBaseRepository<T>;

export abstract class BaseRepositoryImpl<T, ID = string | number> implements IBaseRepository<T, ID> {
  abstract findById(id: ID): Promise<T | null>;
}
