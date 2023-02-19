import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../../../users/domain/entities/user.entity';
import { UserPrivateEntityRepository } from '../../../gateways/database/user-private-entity.repository';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userPrivateRepo: UserPrivateEntityRepository) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    const userPrivate = await this.userPrivateRepo.findOneByEmail(email);
    if (!userPrivate) throw new UnauthorizedException();

    const passwordMatch = await userPrivate.comparePassword(password);
    if (!passwordMatch) throw new UnauthorizedException();

    return userPrivate.user;
  }
}
