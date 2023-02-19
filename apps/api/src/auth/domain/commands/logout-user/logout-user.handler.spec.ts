import { UserPrivateEntityRepository } from '../../../gateways/database/user-private-entity.repository';
import { TestBed } from '@automock/jest';
import { UserPrivate } from '../../entities/user-private.entity';
import { User } from '../../../../users/domain/entities/user.entity';
import { UserPrivateNotFoundException } from '../../exceptions/exceptions';
import { MockUserPrivate } from '../../../test/mocks/mocks';
import { LogoutUserHandler } from './logout-user.handler';
import { LogoutUserCommand } from './logout-user.command';

describe('LogOutUserHandler', () => {
  const mockUserId = 'testUserId';
  const mockUserPrivateId = 'testUserPrivateId';

  let userPrivateRepo: jest.Mocked<UserPrivateEntityRepository>;
  let uut: LogoutUserHandler;

  let mockUser: User;
  let mockUserPrivate: jest.Mocked<UserPrivate>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(LogoutUserHandler).compile();

    uut = unit;
    userPrivateRepo = unitRef.get(UserPrivateEntityRepository);

    mockUser = new User(mockUserId, 'test@email.com');
    mockUserPrivate = new MockUserPrivate(
      mockUserPrivateId,
      mockUser,
      null,
      null,
    ) as unknown as jest.Mocked<UserPrivate>;
  });

  it('should update user refresh token hash', async () => {
    // arrange
    const command = new LogoutUserCommand(mockUserId);
    userPrivateRepo.findOneByUserId.mockResolvedValueOnce(mockUserPrivate);
    // act
    await uut.execute(command);
    // assert
    expect(mockUserPrivate.setRefreshTokenHash).toHaveBeenCalledWith(null);
    expect(userPrivateRepo.updateOneRefreshTokenHash).toHaveBeenCalledWith(
      mockUserPrivateId,
      null,
    );
  });

  it('should throw not found exception if user not found', async () => {
    // arrange
    const command = new LogoutUserCommand(mockUserId);
    userPrivateRepo.findOneByUserId.mockResolvedValueOnce(null);
    // act & assert error
    expect(uut.execute(command)).rejects.toEqual(
      new UserPrivateNotFoundException(),
    );
  });
});
