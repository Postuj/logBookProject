import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class UserPrivateNotFoundException extends NotFoundException {
  constructor() {
    super('UserPrivate not found');
  }
}

export class IncorrectPasswordException extends ForbiddenException {
  constructor() {
    super('Incorrect password');
  }
}

export class EmailOccupiedException extends ForbiddenException {
  constructor() {
    super('Email already occupied');
  }
}

export class RefreshTokensDoNotMatchException extends UnauthorizedException {}
