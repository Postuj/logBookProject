import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserPrivateEntityRepository } from '../../../gateways/database/user-private-entity.repository';
import { UserPrivate } from '../../entities/user-private.entity';
import { UserPrivateNotFoundException } from '../../exceptions/exceptions';
import { LogoutUserCommand } from './logout-user.command';

@CommandHandler(LogoutUserCommand)
export class LogoutUserHandler implements ICommandHandler<LogoutUserCommand> {
  private readonly logger = new Logger(LogoutUserHandler.name);

  constructor(private readonly userPrivateRepo: UserPrivateEntityRepository) {}

  async execute(command: LogoutUserCommand): Promise<void> {
    const userPrivate = await this.getUserPrivate(command.userId);

    await userPrivate.setRefreshTokenHash(null);
    await this.userPrivateRepo.updateOneRefreshTokenHash(userPrivate.id, null);

    this.logger.log(`User@${userPrivate.user.email} has logged out`);
  }

  private async getUserPrivate(userId: string): Promise<UserPrivate> {
    const userPrivate = await this.userPrivateRepo.findOneByUserId(userId);
    if (!userPrivate) throw new UserPrivateNotFoundException();
    return userPrivate;
  }
}
