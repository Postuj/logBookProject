import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { WorkoutRepository } from '../../../gateways/database/workouts/workout.repository';
import { Workout } from '../../entities/workout/workout.entity';
import { UserWorkoutsQuery } from './user-workouts.query';

@QueryHandler(UserWorkoutsQuery)
export class UserWorkoutsHandler implements IQueryHandler<UserWorkoutsQuery> {
  constructor(private readonly workoutsRepo: WorkoutRepository) {}

  execute(query: UserWorkoutsQuery): Promise<Workout[]> {
    return this.workoutsRepo.findByUserId(query.userId);
  }
}
