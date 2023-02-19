import { UserPrivate } from '../../entities/user-private.entity';

export class RefreshAccessTokenCommand {
  constructor(public readonly userPrivate: UserPrivate) {}
}
