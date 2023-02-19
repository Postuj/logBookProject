import { NotFoundException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { EntitySchemaMapper } from './entity-schema.factory';
import { IdentifiableEntitySchema } from './identifiable-entity.schema';

export abstract class EntityRepository<
  TSchema extends IdentifiableEntitySchema,
  TEntity extends AggregateRoot,
> {
  constructor(
    protected readonly entityRepo: Repository<TSchema>,
    protected readonly entitySchemaMapper: EntitySchemaMapper<TSchema, TEntity>,
  ) {}

  protected async findOne(
    entityFilterQuery?: FindOneOptions<TSchema>,
  ): Promise<TEntity> {
    const entity = await this.entityRepo.findOne(entityFilterQuery);

    if (!entity) {
      throw new NotFoundException('Entity was not found.');
    }

    return this.entitySchemaMapper.fromSchema(entity);
  }

  protected async find(
    entityFilterQuery?: FindManyOptions<TSchema>,
  ): Promise<TEntity[]> {
    return (await this.entityRepo.find(entityFilterQuery)).map(
      (entityDocument) => this.entitySchemaMapper.fromSchema(entityDocument),
    );
  }

  async create(entity: TEntity): Promise<TEntity> {
    const entitySchema = await this.entityRepo.save(
      this.entitySchemaMapper.toSchema(entity),
    );
    return this.entitySchemaMapper.fromSchema(entitySchema);
  }
}
