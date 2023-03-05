import { IdentifiableEntity } from '../../../../core/identifiable.entity';
import { ExerciseOptions } from '../exercise-template/exercise-template.entity';
import { Series } from '../series/series.entity';

export class Exercise extends IdentifiableEntity {
  public hasRepetitions: boolean;
  public hasWeight: boolean;
  public hasTime: boolean;

  constructor(
    id: string,
    public readonly workoutId: string,
    public name: string,
    options: ExerciseOptions,
    public series: Series[] = [],
    public readonly exerciseTemplateId?: string,
  ) {
    super(id);
    this.hasRepetitions = options.hasRepetitions;
    this.hasWeight = options.hasWeight;
    this.hasTime = options.hasTime;
  }
}
