import { IdentifiableEntity } from '../../../../core/identifiable.entity';
import { Exercise } from '../exercise/exercise.entity';

export class Workout extends IdentifiableEntity {
  constructor(
    id: string,
    public name: string,
    public readonly createdById: string,
    public exercises: Exercise[],
    public readonly createdAt: Date,
    public readonly finishedAt?: Date,
    public readonly workoutTemplateId?: string,
  ) {
    super(id);
  }
}
