import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IdentifiableEntityRepository } from '../../../../database/base-entity.repository';
import { EntityNotFoundException } from '../../../../database/exceptions';
import { ExerciseTemplate } from '../../../domain/entities/exercise-template/exercise-template.entity';
import { ExerciseTemplateSchemaMapper } from './exercise-template-schema.mapper';
import { ExerciseTemplateSchema } from './exercise-template.schema';

@Injectable()
export class ExerciseTemplatesRepository extends IdentifiableEntityRepository<
  ExerciseTemplateSchema,
  ExerciseTemplate
> {
  constructor(
    @InjectRepository(ExerciseTemplateSchema)
    exerciseTemplateRepo: Repository<ExerciseTemplateSchema>,
    entitySchemaMapper: ExerciseTemplateSchemaMapper,
  ) {
    super(exerciseTemplateRepo, entitySchemaMapper);
  }

  async findOneByNameAndUser(
    name: string,
    userId: string,
  ): Promise<ExerciseTemplate | null> {
    const schema = await this.entityRepo.findOneBy({
      name,
      createdById: userId,
    });

    if (!schema) return null;
    return this.entitySchemaMapper.fromSchema(schema);
  }

  async findManyByIds(ids: string[]): Promise<ExerciseTemplate[]> {
    const schemas = await this.entityRepo.find({
      where: {
        id: In(ids),
      },
    });
    return schemas.map((schema) => this.entitySchemaMapper.fromSchema(schema));
  }

  async findByUserId(userId: string): Promise<ExerciseTemplate[]> {
    const schemas = await this.entityRepo.findBy({ createdById: userId });
    return schemas.map((schema) => this.entitySchemaMapper.fromSchema(schema));
  }

  async deleteOneById(id: string): Promise<void> {
    try {
      await this.entityRepo
        .createQueryBuilder('exercise_templates')
        .delete()
        .from(ExerciseTemplateSchema)
        .where('id = :id', { id })
        .execute();
    } catch (_) {
      throw new EntityNotFoundException();
    }
  }

  async save(entity: ExerciseTemplate): Promise<ExerciseTemplate> {
    const schema = await this.entityRepo.save(
      this.entitySchemaMapper.toSchema(entity),
    );
    return this.entitySchemaMapper.fromSchema(schema);
  }
}
