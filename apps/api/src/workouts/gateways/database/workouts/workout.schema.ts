import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IdentifiableEntitySchema } from '../../../../database/identifiable-entity.schema';
import { UserSchema } from '../../../../users/gateways/database/user.schema';
import { ExerciseSchema } from '../exercises/exercise.schema';
import { WorkoutTemplateSchema } from '../workout-templates/workout-template.schema';

@Entity('workouts')
export class WorkoutSchema extends IdentifiableEntitySchema {
  @Column()
  name: string;

  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserSchema;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => WorkoutTemplateSchema, {
    nullable: true,
    orphanedRowAction: 'nullify',
  })
  @JoinColumn({ name: 'template_id' })
  template?: WorkoutTemplateSchema;

  @Column({ name: 'template_id', nullable: true })
  templateId?: string;

  @OneToMany(() => ExerciseSchema, (exercise) => exercise.workout, {
    eager: true,
    cascade: true,
  })
  exercises: ExerciseSchema[];

  @Column({ type: 'timestamptz', name: 'finished_at' })
  finishedAt?: Date;
}
