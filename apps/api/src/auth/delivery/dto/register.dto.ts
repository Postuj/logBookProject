import { ApiProperty } from '@nestjs/swagger';
import { AuthTokensDto } from './auth-tokens.dto';
import { CredentialsDto } from './credentials.dto';

export class RegisterRequestDto extends CredentialsDto {}

export class RegisterResponseDto extends AuthTokensDto {
  @ApiProperty()
  userId: string;
}
