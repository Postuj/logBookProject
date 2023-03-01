import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdentifiableEntityRepository } from '../../../../database/base-entity.repository';
import { EntityNotFoundException } from '../../../../database/exceptions';
import { WorkoutTemplate } from '../../../domain/entities/workout-template/workout-template.entity';
import { WorkoutTemplateSchemaMapper } from './workout-template-schema.mapper';
import { WorkoutTemplateSchema } from './workout-template.schema';

@Injectable()
export class WorkoutTemplatesRepository extends IdentifiableEntityRepository<
  WorkoutTemplateSchema,
  WorkoutTemplate
> {
  constructor(
    @InjectRepository(WorkoutTemplateSchema)
    workoutTemplateRepo: Repository<WorkoutTemplateSchema>,
    entitySchemaMapper: WorkoutTemplateSchemaMapper,
  ) {
    super(workoutTemplateRepo, entitySchemaMapper);
  }

  async findOneByName(name: string): Promise<WorkoutTemplate | null> {
    const schema = await this.entityRepo.findOneBy({ name });
    if (!schema) return null;
    return this.entitySchemaMapper.fromSchema(schema);
  }

  async findOneByNameAndUser(
    name: string,
    userId: string,
  ): Promise<WorkoutTemplate | null> {
    const schema = await this.entityRepo.findOneBy({
      name,
      createdById: userId,
    });
    if (!schema) return null;
    return this.entitySchemaMapper.fromSchema(schema);
  }

  async findByUserId(userId: string): Promise<WorkoutTemplate[]> {
    const schemas = await this.entityRepo.findBy({ createdById: userId });
    return schemas.map((schema) => this.entitySchemaMapper.fromSchema(schema));
  }

  async deleteOneById(id: string): Promise<void> {
    try {
      await this.entityRepo
        .createQueryBuilder('workout_templates')
        .delete()
        .from(WorkoutTemplateSchema)
        .where('id = :id', { id })
        .execute();
    } catch (_) {
      throw new EntityNotFoundException();
    }
  }

  async save(entity: WorkoutTemplate): Promise<WorkoutTemplate> {
    const schema = await this.entityRepo.save(
      this.entitySchemaMapper.toSchema(entity),
    );
    return this.entitySchemaMapper.fromSchema(schema);
  }
}
