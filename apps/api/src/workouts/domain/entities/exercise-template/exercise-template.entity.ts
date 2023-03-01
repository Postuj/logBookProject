import { IdentifiableEntity } from '../../../../core/identifiable.entity';

export type ExerciseOptions = {
  hasRepetitions: boolean;
  hasTime: boolean;
  hasWeight: boolean;
};

export class ExerciseTemplate extends IdentifiableEntity {
  constructor(
    id: string,
    private _name: string,
    private _options: ExerciseOptions,
    public readonly createdById: string,
  ) {
    super(id);
  }

  public get name(): string {
    return this._name;
  }

  public set name(newName: string) {
    this._name = newName;
  }

  public get options(): ExerciseOptions {
    return this._options;
  }

  public set options(newOptions: ExerciseOptions) {
    this._options = newOptions;
  }
}
