import { Logger, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from './register-user.command';
import { UserPrivateFactory } from '../../factories/user-private.factory';
import { UserPrivateEntityRepository } from '../../../gateways/database/user-private-entity.repository';
import { UserPrivate } from '../../entities/user-private.entity';
import { AuthService } from '../../services/auth.service';
import { EmailOccupiedException } from '../../exceptions/exceptions';

export type RegisterUserCommandOutput = {
  accessToken: string;
  refreshToken: string;
};

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  private readonly logger = new Logger(RegisterUserHandler.name);

  constructor(
    private readonly userPrivateRepo: UserPrivateEntityRepository,
    private readonly userPrivateFactory: UserPrivateFactory,
    private readonly authService: AuthService,
  ) {}

  async execute(
    command: RegisterUserCommand,
  ): Promise<RegisterUserCommandOutput> {
    const { email, password } = command;
    await this.checkIfEmailIsOccupied(email);

    const userPrivate = await this.createUserPrivate(email, password);
    const tokens = await this.authService.createAccessAndRefreshTokens(
      userPrivate.user.id,
      email,
    );

    await userPrivate.setRefreshTokenHash(tokens.refreshToken);
    await this.userPrivateRepo.updateOneRefreshTokenHash(
      userPrivate.id,
      userPrivate.refreshTokenHash,
    );

    return tokens;
  }

  private async checkIfEmailIsOccupied(email: string): Promise<void> {
    const user = await this.userPrivateRepo.findOneByEmail(email);
    if (user) throw new EmailOccupiedException();
  }

  private async createUserPrivate(
    email: string,
    password: string,
  ): Promise<UserPrivate> {
    this.logger.log(`Registering user ${email}`);
    const user = await this.userPrivateFactory.create(email, password);
    return user;
  }
}
