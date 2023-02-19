import { Column, Entity } from 'typeorm';
import { BaseSchema } from '../../../database/base.schema';

@Entity('users')
export class UserSchema extends BaseSchema {
  @Column()
  email: string;
}
