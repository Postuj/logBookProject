import { Injectable } from '@nestjs/common';
import { EntitySchemaMapper } from '../../../../database/entity-schema.factory';
import { Exercise } from '../../../domain/entities/exercise/exercise.entity';
import { SeriesSchemaMapper } from '../series/series-schema.mapper';
import { ExerciseSchema } from './exercise.schema';

@Injectable()
export class ExerciseSchemaMapper
  implements EntitySchemaMapper<ExerciseSchema, Exercise>
{
  constructor(private readonly seriesMapper: SeriesSchemaMapper) {}

  toSchema(entity: Exercise): ExerciseSchema {
    return {
      id: entity.id ?? undefined,
      workoutId: entity.workoutId,
      name: entity.name,
      hasRepetitions: entity.hasRepetitions,
      hasWeight: entity.hasWeight,
      hasTime: entity.hasTime,
      exerciseTemplateId: entity.exerciseTemplateId,
      series: entity.series.map((series) => this.seriesMapper.toSchema(series)),
    } as ExerciseSchema;
  }

  fromSchema(schema: ExerciseSchema): Exercise {
    return new Exercise(
      schema.id,
      schema.workoutId,
      schema.name,
      {
        hasRepetitions: schema.hasRepetitions,
        hasWeight: schema.hasWeight,
        hasTime: schema.hasTime,
      },
      schema.series?.map((series) => this.seriesMapper.fromSchema(series)) ??
        [],
      schema.exerciseTemplateId,
    );
  }
}
