import { IdentifiableEntity } from '../../../../core/identifiable.entity';
import { ExerciseTemplate } from '../exercise-template/exercise-template.entity';

export class WorkoutTemplate extends IdentifiableEntity {
  constructor(
    id: string,
    private _name: string,
    private _exerciseTemplates: ExerciseTemplate[],
    public readonly createdById: string,
    public readonly createdAt: Date,
  ) {
    super(id);
  }

  public get name(): string {
    return this._name;
  }

  public set name(newName: string) {
    this._name = newName;
  }

  public get exerciseTemplates(): ExerciseTemplate[] {
    return this._exerciseTemplates;
  }

  public set exerciseTemplates(templates: ExerciseTemplate[]) {
    this._exerciseTemplates = templates;
  }
}
