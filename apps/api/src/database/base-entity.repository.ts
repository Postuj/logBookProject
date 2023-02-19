import { AggregateRoot } from '@nestjs/cqrs';
import { FindOneOptions } from 'typeorm';
import { EntityRepository } from './entity.repository';

import { IdentifiableEntitySchema } from './identifiable-entity.schema';

export abstract class BaseEntityRepository<
  TSchema extends IdentifiableEntitySchema,
  TEntity extends AggregateRoot,
> extends EntityRepository<TSchema, TEntity> {
  async findOneById(id: string): Promise<TEntity> {
    return this.findOne({ where: { id } } as FindOneOptions<TSchema>);
  }

  async findAll(): Promise<TEntity[]> {
    return this.find();
  }
}
