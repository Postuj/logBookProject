import { User } from '../../../users/domain/entities/user.entity';

export class MockUserPrivate {
  constructor(
    public readonly id: string,
    public readonly user: User,
    public passwordHash?: string,
    public refreshTokenHash?: string,
  ) {}

  public setRefreshTokenHash = jest.fn();
  public compareRefreshToken = jest.fn();
  public setPasswordHash = jest.fn();
  public comparePassword = jest.fn();
}
