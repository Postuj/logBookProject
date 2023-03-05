import { IdentifiableEntity } from '../../../../core/identifiable.entity';

export type ExerciseOptions = {
  hasRepetitions: boolean;
  hasTime: boolean;
  hasWeight: boolean;
};

export class ExerciseTemplate extends IdentifiableEntity {
  constructor(
    id: string,
    public name: string,
    public options: ExerciseOptions,
    public readonly createdById: string,
  ) {
    super(id);
  }
}
