import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDoesNotOwnTheResourceException } from '../../../../core/exceptions';
import { WorkoutRepository } from '../../../gateways/database/workouts/workout.repository';
import { DeleteWorkoutCommand } from './delete-workout.command';

@CommandHandler(DeleteWorkoutCommand)
export class DeleteWorkoutHandler
  implements ICommandHandler<DeleteWorkoutCommand>
{
  private readonly logger = new Logger(DeleteWorkoutHandler.name);

  constructor(private readonly workoutsRepo: WorkoutRepository) {}

  async execute(command: DeleteWorkoutCommand): Promise<void> {
    const { userId, workoutId } = command;

    const workout = await this.workoutsRepo.findOneById(workoutId);
    if (workout.createdById !== userId)
      throw new UserDoesNotOwnTheResourceException();

    this.logger.log(`User@${userId} deleted workout`);
    await this.workoutsRepo.remove(workout);
  }
}
