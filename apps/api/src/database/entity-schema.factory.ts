import { AggregateRoot } from '@nestjs/cqrs';

import { IdentifiableEntitySchema } from './identifiable-entity.schema';

export interface EntitySchemaMapper<
  TSchema extends IdentifiableEntitySchema,
  TEntity extends AggregateRoot,
> {
  toSchema(entity: TEntity): TSchema;
  fromSchema(entitySchema: TSchema): TEntity;
}
