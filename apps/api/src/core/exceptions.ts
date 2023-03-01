import { ForbiddenException } from '@nestjs/common';

export class UserDoesNotOwnTheResourceException extends ForbiddenException {}
