import { Entity } from './entity';

export interface DtoMapper<TEntity extends Entity, TDto> {
  toDto(entity: TEntity): TDto;
}
