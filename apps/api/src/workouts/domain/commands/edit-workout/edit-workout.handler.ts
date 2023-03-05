import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDoesNotOwnTheResourceException } from '../../../../core/exceptions';
import { WorkoutRepository } from '../../../gateways/database/workouts/workout.repository';
import { Workout } from '../../entities/workout/workout.entity';
import { WorkoutFactory } from '../../entities/workout/workout.factory';
import { EditWorkoutCommand } from './edit-workout.command';

@CommandHandler(EditWorkoutCommand)
export class EditWorkoutHandler implements ICommandHandler<EditWorkoutCommand> {
  private readonly logger = new Logger(EditWorkoutHandler.name);

  constructor(
    private readonly workoutsRepo: WorkoutRepository,
    private readonly workoutFactory: WorkoutFactory,
  ) {}

  async execute(command: EditWorkoutCommand): Promise<Workout> {
    const { userId, workoutId, data } = command;

    let workout = await this.workoutsRepo.findOneById(workoutId);

    if (workout.createdById !== userId)
      throw new UserDoesNotOwnTheResourceException();

    workout = await this.workoutFactory.recreateFromProps(
      workoutId,
      userId,
      data,
      workout.finishedAt,
    );

    workout = await this.workoutsRepo.save(workout);
    this.logger.log(`User@${userId} edited workout`);
    return workout;
  }
}
