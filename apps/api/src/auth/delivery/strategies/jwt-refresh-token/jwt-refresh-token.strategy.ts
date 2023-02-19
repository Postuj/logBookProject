import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../../../users/domain/entities/user.entity';
import { UserPrivate } from '../../../domain/entities/user-private.entity';
import { UserPrivateEntityRepository } from '../../../gateways/database/user-private-entity.repository';
import { RefreshTokensDoNotMatchException } from '../../../domain/exceptions/exceptions';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly userPrivateRepo: UserPrivateEntityRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }): Promise<UserPrivate> {
    const userPrivate = await this.getUserPrivate(payload.sub);
    const refreshToken = req.body.refreshToken.trim();
    await this.validateRefreshTokens(userPrivate, refreshToken);

    return userPrivate;
  }

  private async getUserPrivate(userId: string): Promise<UserPrivate> {
    try {
      const userPrivate = await this.userPrivateRepo.findOneByUserId(userId);
      return userPrivate;
    } catch (_) {
      throw new UnauthorizedException();
    }
  }

  private async validateRefreshTokens(
    userPrivate: UserPrivate,
    refreshToken: string,
  ): Promise<void> {
    const refreshTokensMatch = await userPrivate.compareRefreshToken(
      refreshToken,
    );

    if (!refreshTokensMatch) throw new RefreshTokensDoNotMatchException();
  }
}
