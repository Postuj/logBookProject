import { Entity } from './entity';

export interface DtoFactory<TEntity extends Entity, TDto> {
  createFromEntity(entity: TEntity): TDto;
}
