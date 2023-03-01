import { Injectable } from '@nestjs/common';
import { EntityFactory } from '../../../../core/entity.factory';
import { ExerciseTemplatesRepository } from '../../../gateways/database/exercise-templates/exercise-template.repository';
import { ExerciseTemplate, ExerciseOptions } from './exercise-template.entity';

@Injectable()
export class ExerciseTemplateFactory
  implements EntityFactory<ExerciseTemplate>
{
  constructor(
    private readonly exerciseTemplatesRepo: ExerciseTemplatesRepository,
  ) {}

  create(
    name: string,
    options: ExerciseOptions,
    createdById: string,
  ): Promise<ExerciseTemplate> {
    return this.exerciseTemplatesRepo.create(
      new ExerciseTemplate(null, name, options, createdById),
    );
  }
}
