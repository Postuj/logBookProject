import { Injectable } from '@nestjs/common';
import { EntitySchemaMapper } from '../../../database/entity-schema.factory';
import { User } from '../../domain/entities/user.entity';
import { UserSchema } from './user.schema';

@Injectable()
export class UserSchemaMapper implements EntitySchemaMapper<UserSchema, User> {
  toSchema(user: User): UserSchema {
    return {
      email: user.email,
    } as UserSchema;
  }

  fromSchema(userSchema: UserSchema): User {
    return new User(userSchema.id, userSchema.email);
  }
}
