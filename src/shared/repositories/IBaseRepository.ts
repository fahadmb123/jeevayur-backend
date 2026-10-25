export interface IBaseRepository<TEntity> {
  findById(id: number): Promise<TEntity | null>;
}
