import { UserPrivate } from '../entities/user-private.entity';

export interface UserPrivateRepository {
  create(entity: UserPrivate): Promise<UserPrivate>;
  findOneByEmail(email: string): Promise<UserPrivate | null>;
  findOneByUserId(userId: string): Promise<UserPrivate | null>;
  updateOneRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void>;
}
