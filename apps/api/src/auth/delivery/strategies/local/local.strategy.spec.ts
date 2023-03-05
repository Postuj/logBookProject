import { TestBed } from '@automock/jest';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { User } from '../../../../users/domain/entities/user.entity';
import { UserPrivate } from '../../../domain/entities/user-private.entity';
import { UserPrivateEntityRepository } from '../../../gateways/database/user-private-entity.repository';
import { MockUserPrivate } from '../../../test/mocks/mocks';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  const mockUserId = 'testUserId';
  const mockUserPrivateId = 'testUserPrivateId';
  const mockRefreshTokenHash = 'mockRefreshTokenHash';
  const email = 'test@email.com';
  const password = 'password';

  let userPrivateRepo: jest.Mocked<UserPrivateEntityRepository>;
  let uut: LocalStrategy;

  let mockUser: User;
  let mockUserPrivate: jest.Mocked<UserPrivate>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(LocalStrategy).compile();

    uut = unit;
    userPrivateRepo = unitRef.get(UserPrivateEntityRepository);

    mockUser = new User(mockUserId, email);
    mockUserPrivate = new MockUserPrivate(
      mockUserPrivateId,
      mockUser,
      null,
      mockRefreshTokenHash,
    ) as unknown as jest.Mocked<UserPrivate>;
  });

  it('should return user if credentials are correct', async () => {
    // arrange
    userPrivateRepo.findOneByEmail.mockResolvedValueOnce(mockUserPrivate);
    mockUserPrivate.comparePassword.mockResolvedValueOnce(true);
    // act
    const result = await uut.validate(email, password);
    // assert
    expect(result).toEqual(mockUser);
    expect(mockUserPrivate.comparePassword).toHaveBeenCalledWith(password);
    expect(userPrivateRepo.findOneByEmail).toHaveBeenCalledWith(email);
  });

  it('should throw unauthorized exception if credentials were incorrect', async () => {
    // arrange
    userPrivateRepo.findOneByEmail.mockResolvedValueOnce(mockUserPrivate);
    mockUserPrivate.comparePassword.mockResolvedValueOnce(false);
    // act & assert error
    expect(uut.validate(email, password)).rejects.toEqual(
      new UnauthorizedException(),
    );
    expect(userPrivateRepo.findOneByEmail).toHaveBeenCalledWith(email);
  });

  it('should throw unauthorized exception if user not found', async () => {
    // arrange
    userPrivateRepo.findOneByEmail.mockResolvedValueOnce(null);
    // act & assert error
    expect(uut.validate(email, password)).rejects.toEqual(
      new UnauthorizedException(),
    );
    expect(userPrivateRepo.findOneByEmail).toHaveBeenCalledWith(email);
    expect(mockUserPrivate.comparePassword).not.toHaveBeenCalled();
  });
});
