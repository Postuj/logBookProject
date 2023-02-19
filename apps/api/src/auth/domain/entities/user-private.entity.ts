import { User } from '../../../users/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { IdentifiableEntity } from '../../../core/identifiable.entity';
import { IncorrectPasswordException } from '../exceptions/exceptions';

export class UserPrivate extends IdentifiableEntity {
  constructor(
    id: string,
    public readonly user: User,
    private _passwordHash: string,
    public readonly _registeredAt: Date,
    private _refreshTokenHash?: string,
  ) {
    super(id);
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get refreshTokenHash(): string | null | undefined {
    return this._refreshTokenHash;
  }

  async setPasswordHash(password: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    if (password === '' || password.length < 5 || password.length > 50)
      throw new IncorrectPasswordException();

    this._passwordHash = await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.passwordHash);
  }

  async setRefreshTokenHash(refreshToken: string | null): Promise<void> {
    this._refreshTokenHash = refreshToken
      ? await bcrypt.hash(refreshToken, await bcrypt.genSalt())
      : null;
  }

  async compareRefreshToken(refreshToken: string): Promise<boolean> {
    if (!this.refreshTokenHash) return false;
    return await bcrypt.compare(refreshToken, this.refreshTokenHash);
  }
}
