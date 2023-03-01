import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CredentialsDto {
  @IsEmail()
  @MinLength(5)
  @MaxLength(50)
  @ApiProperty({ minLength: 5, maxLength: 50, default: 'swagger@mail.com' })
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @ApiProperty({ minLength: 5, maxLength: 50, default: 'password' })
  password: string;
}
