import { ExerciseOptions } from '../../entities/exercise-template/exercise-template.entity';

export class CreateExerciseTemplateCommand {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly options: ExerciseOptions,
  ) {}
}
