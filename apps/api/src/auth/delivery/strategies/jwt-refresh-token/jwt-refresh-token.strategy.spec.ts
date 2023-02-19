import { TestBed } from '@automock/jest';
import { User } from '../../../../users/domain/entities/user.entity';
import { UserPrivate } from '../../../domain/entities/user-private.entity';
import { UserPrivateEntityRepository } from '../../../gateways/database/user-private-entity.repository';
import { MockUserPrivate } from '../../../test/mocks/mocks';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokensDoNotMatchException } from '../../../domain/exceptions/exceptions';

describe.only('JwtRefreshTokenStrategy', () => {
  const env = process.env;
  const mockUserId = 'testUserId';
  const mockUserPrivateId = 'testUserPrivateId';
  const mockRefreshTokenHash = 'mockRefreshTokenHash';
  const email = 'test@email.com';
  const payload = { sub: mockUserId };

  let userPrivateRepo: jest.Mocked<UserPrivateEntityRepository>;
  let uut: JwtRefreshTokenStrategy;

  let mockUser: User;
  let mockUserPrivate: jest.Mocked<UserPrivate>;

  beforeEach(async () => {
    process.env = { ...env };
    process.env.JWT_REFRESH_SECRET = '123';
    const { unit, unitRef } = TestBed.create(JwtRefreshTokenStrategy).compile();

    uut = unit;
    userPrivateRepo = unitRef.get(UserPrivateEntityRepository);

    mockUser = new User(mockUserId, email);
    mockUserPrivate = new MockUserPrivate(
      mockUserPrivateId,
      mockUser,
      null,
      mockRefreshTokenHash,
    ) as unknown as jest.Mocked<UserPrivate>;

    userPrivateRepo.findOneByUserId.mockReset();
  });

  afterEach(() => {
    process.env = env;
  });

  it('should return user if refresh token is valid', async () => {
    // arrange
    const refreshToken = '123';
    userPrivateRepo.findOneByUserId.mockResolvedValueOnce(mockUserPrivate);
    mockUserPrivate.compareRefreshToken.mockResolvedValueOnce(true);
    // act
    const result = await uut.validate(
      { body: { refreshToken } } as Request,
      payload,
    );
    // assert
    expect(result).toEqual(mockUserPrivate);
    expect(userPrivateRepo.findOneByUserId).toHaveBeenCalledWith(mockUserId);
    expect(mockUserPrivate.compareRefreshToken).toHaveBeenCalledWith(
      refreshToken,
    );
  });

  it('should throw unauthorized exception if user not found', async () => {
    // arrange
    const refreshToken = '123';
    userPrivateRepo.findOneByUserId.mockRejectedValueOnce(null);
    // act & assert error
    expect(
      uut.validate({ body: { refreshToken } } as Request, payload),
    ).rejects.toEqual(new UnauthorizedException());
    expect(userPrivateRepo.findOneByUserId).toHaveBeenCalledWith(mockUserId);
  });

  it('should throw unauthorized exception if refresh token hashes do not match', async () => {
    // arrange
    const refreshToken = '123';
    userPrivateRepo.findOneByUserId.mockResolvedValueOnce(mockUserPrivate);
    mockUserPrivate.compareRefreshToken.mockResolvedValueOnce(false);
    // act & assert error
    expect(
      uut.validate({ body: { refreshToken } } as Request, payload),
    ).rejects.toEqual(new RefreshTokensDoNotMatchException());
    expect(userPrivateRepo.findOneByUserId).toHaveBeenCalledWith(mockUserId);
  });
});
