import { ManyToOne, JoinColumn, Column } from 'typeorm';
import { IdentifiableEntitySchema } from '../../../database/identifiable-entity.schema';
import { UserSchema } from './user.schema';

export class EntityCreatedByUserSchema extends IdentifiableEntitySchema {
  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserSchema;

  @Column({ name: 'created_by_id' })
  createdById: string;
}
