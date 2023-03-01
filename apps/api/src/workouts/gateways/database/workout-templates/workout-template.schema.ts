import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IdentifiableEntitySchema } from '../../../../database/identifiable-entity.schema';
import { EntityCreatedByUserSchema } from '../../../../users/gateways/database/entity-created-by-user.schema';
import { ExerciseTemplateSchema } from '../exercise-templates/exercise-template.schema';

@Entity('workout_templates')
export class WorkoutTemplateSchema extends EntityCreatedByUserSchema {
  @Column()
  name: string;

  @OneToMany(
    () => WorkoutExerciseTemplateSchema,
    (workoutExerciseTemplate) => workoutExerciseTemplate.workoutTemplate,
    { eager: true, cascade: ['insert', 'update'] },
  )
  exerciseTemplates: WorkoutExerciseTemplateSchema[];
}

@Entity('workout_exercises_templates')
export class WorkoutExerciseTemplateSchema extends IdentifiableEntitySchema {
  @ManyToOne(() => WorkoutTemplateSchema, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'workout_template_id' })
  workoutTemplate: WorkoutTemplateSchema;

  @Column({ name: 'workout_template_id' })
  workoutTemplateId: string;

  @ManyToOne(() => ExerciseTemplateSchema, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'exercise_template_id' })
  exerciseTemplate: ExerciseTemplateSchema;

  @Column({ name: 'exercise_template_id' })
  exerciseTemplateId: string;
}
