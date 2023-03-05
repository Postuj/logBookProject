import { Injectable } from '@nestjs/common';
import { DtoMapper } from '../../../core/dto.mapper';
import { Exercise } from '../../domain/entities/exercise/exercise.entity';
import { ExerciseDto } from '../dto/exercise.dto';
import { SeriesDtoMapper } from './series-dto.mapper';

@Injectable()
export class ExerciseDtoMapper implements DtoMapper<Exercise, ExerciseDto> {
  constructor(private readonly seriesMapper: SeriesDtoMapper) {}

  toDto(entity: Exercise): ExerciseDto {
    return {
      id: entity.id,
      name: entity.name,
      hasRepetitions: entity.hasRepetitions,
      hasWeight: entity.hasWeight,
      hasTime: entity.hasTime,
      templateId: entity.exerciseTemplateId,
      series: entity.series.map((series) => this.seriesMapper.toDto(series)),
    };
  }
}
