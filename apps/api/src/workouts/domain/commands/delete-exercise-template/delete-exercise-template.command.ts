export class DeleteExerciseTemplateCommand {
  constructor(
    public readonly userId: string,
    public readonly templateId: string,
  ) {}
}
