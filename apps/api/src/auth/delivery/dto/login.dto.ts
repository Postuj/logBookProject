import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthTokensDto } from './auth-tokens.dto';
import { CredentialsDto } from './credentials.dto';

export class LoginRequestDto extends CredentialsDto {}

export class LoginResponseDto extends AuthTokensDto {
  @ApiProperty()
  userId: string;
}
