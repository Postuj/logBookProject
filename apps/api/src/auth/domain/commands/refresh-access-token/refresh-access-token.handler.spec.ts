import { UserPrivateEntityRepository } from '../../../gateways/database/user-private-entity.repository';
import { AuthService } from '../../services/auth.service';
import { TestBed } from '@automock/jest';
import { UserPrivate } from '../../entities/user-private.entity';
import { User } from '../../../../users/domain/entities/user.entity';
import {
  RefreshTokensDoNotMatchException,
  UserPrivateNotFoundException,
} from '../../exceptions/exceptions';
import { MockUserPrivate } from '../../../test/mocks/mocks';
import { RefreshAccessTokenHandler } from './refresh-access-token.handler';
import { RefreshAccessTokenCommand } from './refresh-access-token.command';

describe('RefreshAccessTokenHandler', () => {
  const mockUserId = 'testUserId';
  const mockUserPrivateId = 'testUserPrivateId';
  const mockRefreshTokenHash = 'mockRefreshTokenHash';
  const mockRefreshToken = 'mockRefreshToken';
  const mockTokens = {
    accessToken: 'acc1',
    refreshToken: 'rfrsh1',
  };

  let userPrivateRepo: jest.Mocked<UserPrivateEntityRepository>;
  let authService: jest.Mocked<AuthService>;
  let uut: RefreshAccessTokenHandler;

  let mockUser: User;
  let mockUserPrivate: jest.Mocked<UserPrivate>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(
      RefreshAccessTokenHandler,
    ).compile();

    uut = unit;
    userPrivateRepo = unitRef.get(UserPrivateEntityRepository);
    authService = unitRef.get(AuthService);

    mockUser = new User(mockUserId, 'test@email.com');
    mockUserPrivate = new MockUserPrivate(
      mockUserPrivateId,
      mockUser,
      null,
      mockRefreshTokenHash,
    ) as unknown as jest.Mocked<UserPrivate>;
  });

  it('should update user refresh token hash and return new tokens', async () => {
    // arrange
    const command = new RefreshAccessTokenCommand(mockUserPrivate);
    authService.createAccessAndRefreshTokens.mockResolvedValueOnce(mockTokens);
    // act
    const result = await uut.execute(command);
    // assert
    expect(result).toEqual(mockTokens);
    expect(mockUserPrivate.setRefreshTokenHash).toHaveBeenCalledWith(
      mockTokens.refreshToken,
    );
    expect(userPrivateRepo.updateOneRefreshTokenHash).toHaveBeenCalledWith(
      mockUserPrivateId,
      mockRefreshTokenHash,
    );
  });
});
