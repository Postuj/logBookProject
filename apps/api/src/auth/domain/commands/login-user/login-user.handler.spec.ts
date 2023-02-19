import { UserPrivateEntityRepository } from '../../../gateways/database/user-private-entity.repository';
import { AuthService } from '../../services/auth.service';
import { LoginUserHandler } from './login-user.handler';
import { TestBed } from '@automock/jest';
import { LoginUserCommand } from './login-user.command';
import { UserPrivate } from '../../entities/user-private.entity';
import { User } from '../../../../users/domain/entities/user.entity';
import { UserPrivateNotFoundException } from '../../exceptions/exceptions';
import { MockUserPrivate } from '../../../test/mocks/mocks';

describe('LogInUserHandler', () => {
  const mockUserId = 'testUserId';
  const mockUserPrivateId = 'testUserPrivateId';
  const mockRefreshTokenHash = 'mockRefreshTokenHash';
  const mockTokens = {
    accessToken: 'acc1',
    refreshToken: 'rfrsh1',
  };

  let userPrivateRepo: jest.Mocked<UserPrivateEntityRepository>;
  let authService: jest.Mocked<AuthService>;
  let uut: LoginUserHandler;

  let mockUser: User;
  let mockUserPrivate: jest.Mocked<UserPrivate>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(LoginUserHandler).compile();

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
    const command = new LoginUserCommand(mockUserId);
    userPrivateRepo.findOneByUserId.mockResolvedValueOnce(mockUserPrivate);
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

  it('should throw not found exception if user not found', async () => {
    // arrange
    const command = new LoginUserCommand(mockUserId);
    userPrivateRepo.findOneByUserId.mockResolvedValueOnce(null);
    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(
      new UserPrivateNotFoundException(),
    );
  });
});
