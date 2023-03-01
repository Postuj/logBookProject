import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserPrivateEntityRepository } from '../../../gateways/database/user-private-entity.repository';
import { UserPrivate } from '../../entities/user-private.entity';
import { UserPrivateNotFoundException } from '../../exceptions/exceptions';
import { AuthService } from '../../services/auth.service';
import { LoginUserCommand } from './login-user.command';

export type LoginUserCommandOutput = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  private readonly logger = new Logger(LoginUserHandler.name);

  constructor(
    private readonly userRepo: UserPrivateEntityRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginUserCommandOutput> {
    const userPrivate = await this.getUserPrivate(command.userId);

    const tokens = await this.authService.createAccessAndRefreshTokens(
      userPrivate.user.id,
      userPrivate.user.email,
    );

    await userPrivate.setRefreshTokenHash(tokens.refreshToken);
    await this.userRepo.updateOneRefreshTokenHash(
      userPrivate.id,
      userPrivate.refreshTokenHash,
    );

    this.logger.log(`User ${userPrivate.user.email} has logged in`);
    return { ...tokens, userId: userPrivate.user.id };
  }

  private async getUserPrivate(userId: string): Promise<UserPrivate> {
    const userPrivate = await this.userRepo.findOneByUserId(userId);
    if (!userPrivate) throw new UserPrivateNotFoundException();
    return userPrivate;
  }
}
