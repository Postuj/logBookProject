export class CreateWorkoutTemplateCommand {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly exerciseTemplateIds: string[],
  ) {}
}
