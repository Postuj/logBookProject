import { Injectable } from '@nestjs/common';
import { EntitySchemaMapper } from '../../../../database/entity-schema.factory';
import { WorkoutTemplate } from '../../../domain/entities/workout-template/workout-template.entity';
import { ExerciseTemplateSchemaMapper } from '../exercise-templates/exercise-template-schema.mapper';
import {
  WorkoutExerciseTemplateSchema,
  WorkoutTemplateSchema,
} from './workout-template.schema';

@Injectable()
export class WorkoutTemplateSchemaMapper
  implements EntitySchemaMapper<WorkoutTemplateSchema, WorkoutTemplate>
{
  constructor(
    private readonly exerciseTemplateMapper: ExerciseTemplateSchemaMapper,
  ) {}

  toSchema(entity: WorkoutTemplate): WorkoutTemplateSchema {
    return {
      id: entity.id ?? undefined,
      name: entity.name,
      createdById: entity.createdById,
      exerciseTemplates:
        entity.exerciseTemplates?.map(
          (exerciseTemplate) =>
            ({
              workoutTemplateId: entity.id,
              exerciseTemplate:
                this.exerciseTemplateMapper.toSchema(exerciseTemplate),
            } as WorkoutExerciseTemplateSchema),
        ) ?? [],
    } as WorkoutTemplateSchema;
  }
  fromSchema(schema: WorkoutTemplateSchema): WorkoutTemplate {
    return new WorkoutTemplate(
      schema.id,
      schema.name,
      schema.exerciseTemplates?.map((item) =>
        this.exerciseTemplateMapper.fromSchema(item.exerciseTemplate),
      ) ?? [],
      schema.createdById,
      schema.createdAt,
    );
  }
}
