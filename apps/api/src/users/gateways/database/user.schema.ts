import { Column, Entity } from 'typeorm';
import { IdentifiableEntitySchema } from '../../../database/identifiable-entity.schema';

@Entity('users')
export class UserSchema extends IdentifiableEntitySchema {
  @Column()
  email: string;
}
