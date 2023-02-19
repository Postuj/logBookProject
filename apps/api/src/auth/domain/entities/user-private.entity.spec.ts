import { User } from '../../../users/domain/entities/user.entity';
import { UserPrivate } from './user-private.entity';
import * as bcrypt from 'bcrypt';
import { IncorrectPasswordException } from '../exceptions/exceptions';

describe('UserPrivateEntity', () => {
  const mockUser = new User('testUserId', 'test@mail.com');
  const userPrivateId = 'testUserPrivateId';
  const salt = '12';
  let bcryptSaltMock: jest.SpyInstance;
  let bcryptHashMock: jest.SpyInstance;

  beforeEach(() => {
    bcryptSaltMock = jest.spyOn(bcrypt, 'genSalt');
    bcryptHashMock = jest.spyOn(bcrypt, 'hash');

    bcryptSaltMock.mockReset();
    bcryptHashMock.mockReset();
  });

  describe('setPasswordHash', () => {
    it('should set password hash to hashed password', async () => {
      // arrange
      const password = 'password';
      const hashedPassword = 'hashedPassword';
      const uut = new UserPrivate(userPrivateId, mockUser, '123', new Date());
      bcryptSaltMock.mockImplementationOnce(() => Promise.resolve(salt));
      bcryptHashMock.mockImplementationOnce(() =>
        Promise.resolve(hashedPassword),
      );
      // act
      await uut.setPasswordHash(password);
      // assert
      expect(uut.passwordHash).toEqual(hashedPassword);
      expect(bcryptSaltMock).toHaveBeenCalled();
      expect(bcryptHashMock).toHaveBeenCalledWith(password, salt);
    });

    it('should throw incorrect password exception if password is empty', async () => {
      // arrange
      const password = '';
      const uut = new UserPrivate(userPrivateId, mockUser, '123', new Date());
      // act & assert error
      expect(uut.setPasswordHash(password)).rejects.toEqual(
        new IncorrectPasswordException(),
      );
    });

    it('should throw incorrect password exception if password is shorter than 5 chars', async () => {
      // arrange
      const password = '123';
      const uut = new UserPrivate(userPrivateId, mockUser, '123', new Date());
      // act & assert error
      expect(uut.setPasswordHash(password)).rejects.toEqual(
        new IncorrectPasswordException(),
      );
    });
  });

  describe('setRefreshTokenHash', () => {
    it('should set refreshTokenHash to hashed refreshToken if it is provided', async () => {
      // arrange
      const refreshToken = 'refreshToken';
      const hashedRefreshToken = 'hashedRefreshToken';
      const uut = new UserPrivate(userPrivateId, mockUser, '123', new Date());
      bcryptSaltMock.mockImplementationOnce(() => Promise.resolve(salt));
      bcryptHashMock.mockImplementationOnce(() =>
        Promise.resolve(hashedRefreshToken),
      );
      // act
      await uut.setRefreshTokenHash(refreshToken);
      // assert
      expect(uut.refreshTokenHash).toEqual(hashedRefreshToken);
      expect(bcryptSaltMock).toHaveBeenCalled();
      expect(bcryptHashMock).toHaveBeenCalledWith(refreshToken, salt);
    });

    it('should set refreshTokenHash to null if refreshToken not provided', async () => {
      // arrange
      const uut = new UserPrivate(userPrivateId, mockUser, '123', new Date());
      // act
      await uut.setRefreshTokenHash(null);
      // assert
      expect(uut.refreshTokenHash).toEqual(null);
      expect(bcryptSaltMock).not.toHaveBeenCalled();
      expect(bcryptHashMock).not.toHaveBeenCalled();
    });
  });
});
