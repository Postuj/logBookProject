import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { WorkoutTemplatesRepository } from '../../../gateways/database/workout-templates/workout-templates.repository';
import { WorkoutTemplate } from '../../entities/workout-template/workout-template.entity';
import { UserWorkoutTemplatesQuery } from './user-workout-templates.query';

@QueryHandler(UserWorkoutTemplatesQuery)
export class UserWorkoutTemplatesHandler
  implements IQueryHandler<UserWorkoutTemplatesQuery>
{
  private readonly logger = new Logger(UserWorkoutTemplatesHandler.name);

  constructor(
    private readonly workoutTemplatesRepo: WorkoutTemplatesRepository,
  ) {}

  async execute(query: UserWorkoutTemplatesQuery): Promise<WorkoutTemplate[]> {
    return this.workoutTemplatesRepo.findByUserId(query.userId);
  }
}
