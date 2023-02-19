import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseEntityRepository } from '../../../database/base-entity.repository';
import { UserEntityRepository } from '../../../users/gateways/database/user-entity.repository';
import { UserPrivate } from '../../domain/entities/user-private.entity';
import { UserPrivateRepository } from '../../domain/gateways/user-private.repository';
import { UserPrivateSchemaMapper } from './user-private-schema.mapper';
import { UserPrivateSchema } from './user-private.schema';

@Injectable()
export class UserPrivateEntityRepository
  extends BaseEntityRepository<UserPrivateSchema, UserPrivate>
  implements UserPrivateRepository
{
  private readonly logger = new Logger(UserPrivateEntityRepository.name);
  constructor(
    @InjectRepository(UserPrivateSchema)
    userPrivateRepo: Repository<UserPrivateSchema>,
    userPrivateSchemaMapper: UserPrivateSchemaMapper,
    private readonly userRepo: UserEntityRepository,
  ) {
    super(userPrivateRepo, userPrivateSchemaMapper);
  }

  async create(entity: UserPrivate): Promise<UserPrivate> {
    const user = await this.userRepo.create(entity.user);
    const userPrivateSchema = await this.entityRepo.save({
      ...this.entitySchemaMapper.toSchema(entity),
      userId: user.id,
    });
    const reloadedPrivateUserSchema = await this.entityRepo.findOneBy({
      id: userPrivateSchema.id,
    });
    return this.entitySchemaMapper.fromSchema(reloadedPrivateUserSchema);
  }

  async findOneByUserId(userId: string): Promise<UserPrivate | null> {
    const entitySchema = await this.entityRepo.findOneBy({
      user: {
        id: userId,
      },
    });
    if (!entitySchema) return null;

    return this.entitySchemaMapper.fromSchema(entitySchema);
  }

  async findOneByEmail(email: string): Promise<UserPrivate | null> {
    const entitySchema = await this.entityRepo.findOneBy({
      user: {
        email,
      },
    });
    if (!entitySchema) return null;

    return this.entitySchemaMapper.fromSchema(entitySchema);
  }

  async updateOneRefreshTokenHash(
    userPrivateId: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.entityRepo.update(userPrivateId, {
      refreshTokenHash,
    });
  }
}
