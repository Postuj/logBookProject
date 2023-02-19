import { Injectable } from '@nestjs/common';
import { EntitySchemaMapper } from '../../../database/entity-schema.factory';
import { UserSchemaMapper } from '../../../users/gateways/database/user-schema.mapper';
import { UserPrivate } from '../../domain/entities/user-private.entity';
import { UserPrivateSchema } from './user-private.schema';

@Injectable()
export class UserPrivateSchemaMapper
  implements EntitySchemaMapper<UserPrivateSchema, UserPrivate>
{
  constructor(private readonly userMapper: UserSchemaMapper) {}

  toSchema(entity: UserPrivate): UserPrivateSchema {
    return {
      passwordHash: entity.passwordHash,
      refreshTokenHash: entity.refreshTokenHash,
    } as UserPrivateSchema;
  }

  fromSchema(schema: UserPrivateSchema): UserPrivate {
    return new UserPrivate(
      schema.id,
      this.userMapper.fromSchema(schema.user),
      schema.passwordHash,
      schema.createdAt,
      schema.refreshTokenHash,
    );
  }
}
