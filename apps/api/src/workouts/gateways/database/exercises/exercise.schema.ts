import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IdentifiableEntitySchema } from '../../../../database/identifiable-entity.schema';
import { ExerciseTemplateSchema } from '../exercise-templates/exercise-template.schema';
import { WorkoutSchema } from '../workouts/workout.schema';
import { SeriesSchema } from '../series/series.schema';

@Entity('exercises')
export class ExerciseSchema extends IdentifiableEntitySchema {
  @Column()
  name: string;

  @Column({ default: false, name: 'has_repetitions' })
  hasRepetitions: boolean;

  @Column({ default: false, name: 'has_weight' })
  hasWeight: boolean;

  @Column({ default: false, name: 'has_time' })
  hasTime: boolean;

  @ManyToOne(() => ExerciseTemplateSchema, {
    nullable: true,
    orphanedRowAction: 'nullify',
  })
  @JoinColumn({ name: 'exercise_template_id' })
  exerciseTemplate?: ExerciseTemplateSchema;

  @Column({ name: 'exercise_template_id', nullable: true })
  exerciseTemplateId?: string;

  @ManyToOne(() => WorkoutSchema, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'workout_id' })
  workout: WorkoutSchema;

  @Column({ name: 'workout_id' })
  workoutId: string;

  @OneToMany(() => SeriesSchema, (series) => series.exercise, {
    eager: true,
    cascade: true,
  })
  series: SeriesSchema[];
}
