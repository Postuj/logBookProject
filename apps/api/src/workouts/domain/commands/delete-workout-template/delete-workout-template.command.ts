export class DeleteWorkoutTemplateCommand {
  constructor(
    public readonly userId: string,
    public readonly templateId: string,
  ) {}
}
