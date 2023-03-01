import { Injectable } from '@nestjs/common';
import { EntityFactory } from '../../../../core/entity.factory';
import { User } from '../../../../users/domain/entities/user.entity';
import { WorkoutTemplatesRepository } from '../../../gateways/database/workout-templates/workout-templates.repository';
import { ExerciseTemplate } from '../exercise-template/exercise-template.entity';
import { WorkoutTemplate } from './workout-template.entity';

@Injectable()
export class WorkoutTemplateFactory implements EntityFactory<WorkoutTemplate> {
  constructor(
    private readonly workoutTemplatesRepo: WorkoutTemplatesRepository,
  ) {}

  async create(
    name: string,
    createdById: string,
    exerciseTemplates: ExerciseTemplate[],
  ): Promise<WorkoutTemplate> {
    return this.workoutTemplatesRepo.create(
      new WorkoutTemplate(null, name, exerciseTemplates, createdById, null),
    );
  }
}
