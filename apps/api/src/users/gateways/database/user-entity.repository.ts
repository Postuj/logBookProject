import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdentifiableEntityRepository } from '../../../database/base-entity.repository';
import { User } from '../../domain/entities/user.entity';
import { UserSchemaMapper } from './user-schema.mapper';
import { UserSchema } from './user.schema';

@Injectable()
export class UserEntityRepository extends IdentifiableEntityRepository<
  UserSchema,
  User
> {
  constructor(
    @InjectRepository(UserSchema)
    usersRepo: Repository<UserSchema>,
    userSchemaMapper: UserSchemaMapper,
  ) {
    super(usersRepo, userSchemaMapper);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const entitySchema = await this.entityRepo.findOneBy({ email });
    if (!entitySchema) return null;

    return this.entitySchemaMapper.fromSchema(entitySchema);
  }
}
