import { IsJWT } from 'class-validator';

export class RefreshAccessTokenRequestDto {
  @IsJWT()
  refreshToken: string;
}
