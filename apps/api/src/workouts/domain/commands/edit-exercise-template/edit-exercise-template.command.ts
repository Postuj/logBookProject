export interface ExerciseTemplateEditableData {
  name?: string;
  hasRepetitions?: boolean;
  hasWeight?: boolean;
  hasTime?: boolean;
}

export class EditExerciseTemplateCommand {
  constructor(
    public readonly userId: string,
    public readonly exerciseTemplateId: string,
    public readonly data: ExerciseTemplateEditableData,
  ) {}
}
