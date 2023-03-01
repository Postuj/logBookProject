import { Column, Entity } from 'typeorm';
import { EntityCreatedByUserSchema } from '../../../../users/gateways/database/entity-created-by-user.schema';

@Entity('exercise_templates')
export class ExerciseTemplateSchema extends EntityCreatedByUserSchema {
  @Column()
  name: string;

  @Column({ default: false })
  hasRepetitions: boolean;

  @Column({ default: false })
  hasWeight: boolean;

  @Column({ default: false })
  hasTime: boolean;
}
