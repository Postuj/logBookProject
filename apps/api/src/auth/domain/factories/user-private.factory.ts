import { Injectable } from '@nestjs/common';
import { UserPrivate } from '../entities/user-private.entity';
import * as bcrypt from 'bcrypt';
import { User } from '../../../users/domain/entities/user.entity';
import { EntityFactory } from '../../../core/entity.factory';
import { UserPrivateEntityRepository } from '../../gateways/database/user-private-entity.repository';

@Injectable()
export class UserPrivateFactory implements EntityFactory<UserPrivate> {
  constructor(private readonly userPrivateRepo: UserPrivateEntityRepository) {}

  async create(email: string, password: string): Promise<UserPrivate> {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.userPrivateRepo.create(
      new UserPrivate(null, new User(null, email), passwordHash, null, null),
    );
    return user;
  }
}
