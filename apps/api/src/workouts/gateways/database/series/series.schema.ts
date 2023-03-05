import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IdentifiableEntitySchema } from '../../../../database/identifiable-entity.schema';
import { ExerciseSchema } from '../exercises/exercise.schema';

@Entity('series')
export class SeriesSchema extends IdentifiableEntitySchema {
  @ManyToOne(() => ExerciseSchema, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'exercise_id' })
  exercise: ExerciseSchema;

  @Column({ name: 'exercise_id' })
  exerciseId: string;

  @Column({ type: 'int', nullable: true })
  repetitions?: number;

  @Column({ type: 'float', nullable: true })
  weight?: number;

  @Column({ type: 'int', nullable: true })
  seconds?: number;
}
