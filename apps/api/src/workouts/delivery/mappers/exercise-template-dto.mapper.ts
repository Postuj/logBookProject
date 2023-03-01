import { Injectable } from '@nestjs/common';
import { DtoMapper } from '../../../core/dto.mapper';
import { ExerciseTemplate } from '../../domain/entities/exercise-template/exercise-template.entity';
import { ExerciseTemplateDto } from '../dto/exercise-template.dto';

@Injectable()
export class ExerciseTemplateDtoMapper
  implements DtoMapper<ExerciseTemplate, ExerciseTemplateDto>
{
  toDto(entity: ExerciseTemplate): ExerciseTemplateDto {
    return {
      id: entity.id,
      createdById: entity.createdById,
      name: entity.name,
      hasRepetitions: entity.options.hasRepetitions,
      hasWeight: entity.options.hasWeight,
      hasTime: entity.options.hasTime,
    };
  }
}
