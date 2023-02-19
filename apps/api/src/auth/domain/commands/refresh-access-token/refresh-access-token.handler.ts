import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { RefreshAccessTokenCommand } from './refresh-access-token.command';
import { UserPrivateEntityRepository } from '../../../gateways/database/user-private-entity.repository';
import { UserPrivate } from '../../entities/user-private.entity';
import { AuthService } from '../../services/auth.service';
import {
  RefreshTokensDoNotMatchException,
  UserPrivateNotFoundException,
} from '../../exceptions/exceptions';

export type RefreshAccessTokenCommandOutput = {
  accessToken: string;
  refreshToken: string;
};

@CommandHandler(RefreshAccessTokenCommand)
export class RefreshAccessTokenHandler
  implements ICommandHandler<RefreshAccessTokenCommand>
{
  private readonly logger = new Logger(RefreshAccessTokenHandler.name);

  constructor(
    private readonly userRepo: UserPrivateEntityRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(
    command: RefreshAccessTokenCommand,
  ): Promise<RefreshAccessTokenCommandOutput> {
    const { userPrivate } = command;

    const tokens = await this.authService.createAccessAndRefreshTokens(
      userPrivate.user.id,
      userPrivate.user.email,
    );

    await userPrivate.setRefreshTokenHash(tokens.refreshToken);
    await this.userRepo.updateOneRefreshTokenHash(
      userPrivate.id,
      userPrivate.refreshTokenHash,
    );

    this.logger.log(`User@${userPrivate.user.email} refreshed access token`);
    return { ...tokens };
  }

  private async getUserPrivate(userId: string): Promise<UserPrivate> {
    const user = await this.userRepo.findOneByUserId(userId);
    if (!user) throw new UserPrivateNotFoundException();
    return user;
  }
}
