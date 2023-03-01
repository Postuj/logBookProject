import { Injectable } from '@nestjs/common';
import { EntitySchemaMapper } from '../../../database/entity-schema.factory';
import { User } from '../../domain/entities/user.entity';
import { UserSchema } from './user.schema';

@Injectable()
export class UserSchemaMapper implements EntitySchemaMapper<UserSchema, User> {
  toSchema(entity: User): UserSchema {
    return {
      email: entity.email,
    } as UserSchema;
  }

  fromSchema(schema: UserSchema): User {
    return new User(schema.id, schema.email);
  }
}
