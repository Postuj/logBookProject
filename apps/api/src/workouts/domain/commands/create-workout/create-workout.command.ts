import { WorkoutProps } from '../../interfaces/interfaces';

export class CreateWorkoutCommand {
  constructor(
    public readonly userId: string,
    public readonly data: WorkoutProps,
  ) {}
}
