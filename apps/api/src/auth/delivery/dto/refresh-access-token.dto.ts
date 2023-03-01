import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class RefreshAccessTokenRequestDto {
  @IsJWT()
  @ApiProperty()
  refreshToken: string;
}
