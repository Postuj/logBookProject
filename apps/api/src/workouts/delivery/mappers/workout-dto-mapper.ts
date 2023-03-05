import { Injectable } from '@nestjs/common';
import { DtoMapper } from '../../../core/dto.mapper';
import { Workout } from '../../domain/entities/workout/workout.entity';
import { WorkoutDto } from '../dto/workout.dto';
import { ExerciseDtoMapper } from './exercise-dto.mapper';

@Injectable()
export class WorkoutDtoMapper implements DtoMapper<Workout, WorkoutDto> {
  constructor(private readonly exerciseMapper: ExerciseDtoMapper) {}

  toDto(entity: Workout): WorkoutDto {
    return {
      id: entity.id,
      name: entity.name,
      createdById: entity.createdById,
      templateId: entity.workoutTemplateId ?? null,
      finishedAt: entity.finishedAt ?? null,
      exercises: entity.exercises.map((exercise) =>
        this.exerciseMapper.toDto(exercise),
      ),
    };
  }
}
