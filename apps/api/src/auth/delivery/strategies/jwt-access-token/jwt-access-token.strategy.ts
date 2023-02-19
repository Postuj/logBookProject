import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../../../users/domain/entities/user.entity';
import { UserEntityRepository } from '../../../../users/gateways/database/user-entity.repository';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userEntityRepo: UserEntityRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<User> {
    try {
      const user = await this.userEntityRepo.findOneById(payload.sub);
      return user;
    } catch (_) {
      throw new UnauthorizedException();
    }
  }
}
