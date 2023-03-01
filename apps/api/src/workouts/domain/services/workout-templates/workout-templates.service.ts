import { Injectable } from '@nestjs/common';
import { WorkoutTemplatesRepository } from '../../../gateways/database/workout-templates/workout-templates.repository';
import { WorkoutTemplateNameOccupiedException } from '../../exceptions/exceptions';

@Injectable()
export class WorkoutTemplatesService {
  constructor(
    private readonly workoutTemplatesRepo: WorkoutTemplatesRepository,
  ) {}

  async checkIfNameIsOccupied(name: string, userId: string): Promise<void> {
    const template = await this.workoutTemplatesRepo.findOneByNameAndUser(
      name,
      userId,
    );
    if (template) throw new WorkoutTemplateNameOccupiedException();
  }
}
