import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdentifiableEntityRepository } from '../../../../database/base-entity.repository';
import { Workout } from '../../../domain/entities/workout/workout.entity';
import { WorkoutSchemaMapper } from './workout-schema.mapper';
import { WorkoutSchema } from './workout.schema';

@Injectable()
export class WorkoutRepository extends IdentifiableEntityRepository<
  WorkoutSchema,
  Workout
> {
  constructor(
    @InjectRepository(WorkoutSchema)
    repo: Repository<WorkoutSchema>,
    mapper: WorkoutSchemaMapper,
  ) {
    super(repo, mapper);
  }

  async findByUserId(userId: string): Promise<Workout[]> {
    const schemas = await this.entityRepo.findBy({ createdById: userId });
    return schemas.map((schema) => this.entitySchemaMapper.fromSchema(schema));
  }

  async remove(entity: Workout): Promise<void> {
    const schema = this.entitySchemaMapper.toSchema(entity);
    await this.entityRepo.remove(schema);
  }

  async save(entity: Workout): Promise<Workout> {
    const schema = this.entitySchemaMapper.toSchema(entity);
    const reloaded = await this.entityRepo.save(schema);
    return this.entitySchemaMapper.fromSchema(reloaded);
  }
}
