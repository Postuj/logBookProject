import { Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '../../../../database/exceptions';
import { ExerciseTemplatesRepository } from '../../../gateways/database/exercise-templates/exercise-template.repository';
import { ExerciseTemplate } from '../../entities/exercise-template/exercise-template.entity';
import { ExerciseTemplateNameOccupiedException } from '../../exceptions/exceptions';

@Injectable()
export class ExerciseTemplatesService {
  constructor(
    private readonly exerciseTemplatesRepo: ExerciseTemplatesRepository,
  ) {}

  async getExerciseTemplatesByIds(
    exerciseTemplateIds: string[],
  ): Promise<ExerciseTemplate[]> {
    if (exerciseTemplateIds.length === 0) return [];
    const uniqueIds = Array.from(new Set(exerciseTemplateIds));
    const templates = await this.exerciseTemplatesRepo.findManyByIds(uniqueIds);

    if (templates.length !== uniqueIds.length)
      throw new EntityNotFoundException();

    return templates;
  }

  async checkIfNameIsOccupied(name: string, userId: string): Promise<void> {
    const template = await this.exerciseTemplatesRepo.findOneByNameAndUser(
      name,
      userId,
    );
    if (template) throw new ExerciseTemplateNameOccupiedException();
  }
}
