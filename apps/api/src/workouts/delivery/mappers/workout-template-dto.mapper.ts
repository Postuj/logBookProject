import { Injectable } from '@nestjs/common';
import { DtoMapper } from '../../../core/dto.mapper';
import { WorkoutTemplate } from '../../domain/entities/workout-template/workout-template.entity';
import { WorkoutTemplateDto } from '../dto/workout-template.dto';
import { ExerciseTemplateDtoMapper } from './exercise-template-dto.mapper';

@Injectable()
export class WorkoutTemplateDtoMapper
  implements DtoMapper<WorkoutTemplate, WorkoutTemplateDto>
{
  constructor(
    private readonly exerciseTemplateDtoMapper: ExerciseTemplateDtoMapper,
  ) {}

  toDto(entity: WorkoutTemplate): WorkoutTemplateDto {
    return {
      id: entity.id,
      name: entity.name,
      createdById: entity.createdById,
      exerciseTemplates: entity.exerciseTemplates.map((template) =>
        this.exerciseTemplateDtoMapper.toDto(template),
      ),
    };
  }
}
