import { Injectable } from '@nestjs/common';
import { EntitySchemaMapper } from '../../../../database/entity-schema.factory';
import { Workout } from '../../../domain/entities/workout/workout.entity';
import { ExerciseSchemaMapper } from '../exercises/exercise-schema.mapper';
import { WorkoutSchema } from './workout.schema';

@Injectable()
export class WorkoutSchemaMapper
  implements EntitySchemaMapper<WorkoutSchema, Workout>
{
  constructor(private readonly exerciseMapper: ExerciseSchemaMapper) {}

  toSchema(entity: Workout): WorkoutSchema {
    return {
      id: entity.id ?? undefined,
      name: entity.name,
      createdById: entity.createdById,
      exercises: entity.exercises.map((exercise) =>
        this.exerciseMapper.toSchema(exercise),
      ),
      finishedAt: entity.finishedAt,
      templateId: entity.workoutTemplateId,
    } as WorkoutSchema;
  }

  fromSchema(schema: WorkoutSchema): Workout {
    return new Workout(
      schema.id,
      schema.name,
      schema.createdById,
      schema.exercises?.map((exercise) =>
        this.exerciseMapper.fromSchema(exercise),
      ) ?? [],
      schema.createdAt,
      schema.finishedAt,
      schema.templateId,
    );
  }
}
