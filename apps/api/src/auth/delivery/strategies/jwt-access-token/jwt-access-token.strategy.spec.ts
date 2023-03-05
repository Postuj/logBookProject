import { TestBed } from '@automock/jest';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../../../../users/domain/entities/user.entity';
import { UserEntityRepository } from '../../../../users/gateways/database/user-entity.repository';
import { JwtAccessTokenStrategy } from './jwt-access-token.strategy';

describe('JwtAccessTokenStrategy', () => {
  const env = process.env;
  const mockUserId = 'testUserId';
  const payload = { sub: mockUserId };

  let userRepo: jest.Mocked<UserEntityRepository>;
  let uut: JwtAccessTokenStrategy;

  let mockUser: User;

  beforeEach(async () => {
    process.env = { ...env };
    process.env.JWT_SECRET = '123';
    const { unit, unitRef } = TestBed.create(JwtAccessTokenStrategy).compile();

    uut = unit;
    userRepo = unitRef.get(UserEntityRepository);

    mockUser = new User(mockUserId, 'test@email.com');
  });

  afterEach(() => {
    process.env = env;
  });

  it('should return user if one found', async () => {
    // arrange
    userRepo.findOneById.mockResolvedValueOnce(mockUser);
    // act
    const result = await uut.validate(payload);
    // assert
    expect(result).toEqual(mockUser);
    expect(userRepo.findOneById).toHaveBeenCalledWith(mockUserId);
  });

  it('should throw unauthorized exception if user not found', async () => {
    // arrange
    userRepo.findOneById.mockRejectedValueOnce(new NotFoundException());
    // act & assert error
    expect(uut.validate(payload)).rejects.toEqual(new UnauthorizedException());
    expect(userRepo.findOneById).toHaveBeenCalledWith(mockUserId);
  });
});
