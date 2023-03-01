import { UserPrivateEntityRepository } from '../../../gateways/database/user-private-entity.repository';
import { AuthService } from '../../services/auth.service';
import { TestBed } from '@automock/jest';
import { UserPrivate } from '../../entities/user-private.entity';
import { User } from '../../../../users/domain/entities/user.entity';
import { EmailOccupiedException } from '../../exceptions/exceptions';
import { MockUserPrivate } from '../../../test/mocks/mocks';
import { RegisterUserHandler } from './register-user.handler';
import { UserPrivateFactory } from '../../factories/user-private.factory';
import { RegisterUserCommand } from './register-user.command';

describe('LogInUserHandler', () => {
  const mockUserId = 'testUserId';
  const mockUserPrivateId = 'testUserPrivateId';
  const mockRefreshTokenHash = 'mockRefreshTokenHash';
  const mockTokens = {
    accessToken: 'acc1',
    refreshToken: 'rfrsh1',
  };
  const email = 'test@email.com';
  const password = 'password';

  let userPrivateRepo: jest.Mocked<UserPrivateEntityRepository>;
  let authService: jest.Mocked<AuthService>;
  let userPrivateFactory: jest.Mocked<UserPrivateFactory>;
  let uut: RegisterUserHandler;

  let mockUser: User;
  let mockUserPrivate: jest.Mocked<UserPrivate>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(RegisterUserHandler).compile();

    uut = unit;
    userPrivateRepo = unitRef.get(UserPrivateEntityRepository);
    userPrivateFactory = unitRef.get(UserPrivateFactory);
    authService = unitRef.get(AuthService);

    mockUser = new User(mockUserId, 'test@email.com');
    mockUserPrivate = new MockUserPrivate(
      mockUserPrivateId,
      mockUser,
      null,
      mockRefreshTokenHash,
    ) as unknown as jest.Mocked<UserPrivate>;
  });

  it('should create user and return new tokens', async () => {
    // arrange
    const command = new RegisterUserCommand(email, password);
    userPrivateRepo.findOneByEmail.mockResolvedValueOnce(null);
    userPrivateFactory.create.mockResolvedValueOnce(mockUserPrivate);
    authService.createAccessAndRefreshTokens.mockResolvedValueOnce(mockTokens);
    // act
    const result = await uut.execute(command);
    // assert
    expect(result).toEqual({ ...mockTokens, userId: mockUserId });
    expect(mockUserPrivate.setRefreshTokenHash).toHaveBeenCalledWith(
      mockTokens.refreshToken,
    );
    expect(userPrivateRepo.updateOneRefreshTokenHash).toHaveBeenCalledWith(
      mockUserPrivateId,
      mockRefreshTokenHash,
    );
  });

  it('should throw email occupied exception if email was already taken', async () => {
    // arrange
    const command = new RegisterUserCommand(email, password);
    userPrivateRepo.findOneByEmail.mockResolvedValueOnce(mockUserPrivate);
    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(new EmailOccupiedException());
    expect(userPrivateRepo.findOneByEmail).toHaveBeenCalledWith(email);
  });
});
