import { WorkoutProps } from '../../interfaces/interfaces';

export class EditWorkoutCommand {
  constructor(
    public readonly userId: string,
    public readonly workoutId: string,
    public readonly data: WorkoutProps,
  ) {}
}
