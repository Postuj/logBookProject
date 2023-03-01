export interface WorkoutTemplateEditableData {
  name?: string;
  exerciseTemplateIds?: string[];
}

export class EditWorkoutTemplateCommand {
  constructor(
    public readonly userId: string,
    public readonly templateId: string,
    public readonly data: WorkoutTemplateEditableData,
  ) {}
}
