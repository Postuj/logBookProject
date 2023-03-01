import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { IdentifiableEntitySchema } from '../../../database/identifiable-entity.schema';
import { UserSchema } from '../../../users/gateways/database/user.schema';

@Entity('users_private')
export class UserPrivateSchema extends IdentifiableEntitySchema {
  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  refreshTokenHash?: string;

  @OneToOne(() => UserSchema, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserSchema;

  @Column({ name: 'user_id' })
  userId: string;
}
