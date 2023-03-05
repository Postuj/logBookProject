export class DeleteWorkoutCommand {
  constructor(
    public readonly userId: string,
    public readonly workoutId: string,
  ) {}
}
