import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Workout } from '../../entities/workout/workout.entity';
import { WorkoutFactory } from '../../entities/workout/workout.factory';
import { CreateWorkoutCommand } from './create-workout.command';

@CommandHandler(CreateWorkoutCommand)
export class CreateWorkoutHandler
  implements ICommandHandler<CreateWorkoutCommand>
{
  private readonly logger = new Logger(CreateWorkoutHandler.name);

  constructor(private readonly workoutFactory: WorkoutFactory) {}

  async execute(command: CreateWorkoutCommand): Promise<Workout> {
    const { userId, data } = command;

    const workout = await this.workoutFactory.create(userId, data);

    this.logger.log(`User@${userId} created workout`);

    return workout;
  }
}
