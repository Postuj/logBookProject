import { Injectable } from '@nestjs/common';
import { EntitySchemaMapper } from '../../../../database/entity-schema.factory';
import { ExerciseTemplate } from '../../../domain/entities/exercise-template/exercise-template.entity';
import { ExerciseTemplateSchema } from './exercise-template.schema';

@Injectable()
export class ExerciseTemplateSchemaMapper
  implements EntitySchemaMapper<ExerciseTemplateSchema, ExerciseTemplate>
{
  toSchema(entity: ExerciseTemplate): ExerciseTemplateSchema {
    return {
      id: entity.id ?? undefined,
      name: entity.name,
      createdById: entity.createdById,
      hasRepetitions: entity.options.hasRepetitions,
      hasWeight: entity.options.hasWeight,
      hasTime: entity.options.hasTime,
    } as ExerciseTemplateSchema;
  }
  fromSchema(schema: ExerciseTemplateSchema): ExerciseTemplate {
    return new ExerciseTemplate(
      schema.id,
      schema.name,
      {
        hasRepetitions: schema.hasRepetitions,
        hasWeight: schema.hasWeight,
        hasTime: schema.hasTime,
      },
      schema.createdById,
    );
  }
}
