import { IdentifiableEntity } from '../../../../core/identifiable.entity';

export interface SeriesValues {
  repetitions?: number;
  weight?: number;
  seconds?: number;
}

export class Series extends IdentifiableEntity {
  public repetitions?: number;
  public weight?: number;
  public seconds?: number;

  constructor(
    id: string,
    public readonly exerciseId: string,
    values: SeriesValues,
  ) {
    super(id);
    this.repetitions = values.repetitions;
    this.weight = values.weight;
    this.seconds = values.seconds;
  }
}
