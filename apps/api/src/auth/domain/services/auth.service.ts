import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly jwtRefreshSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtRefreshSecret = this.configService.get('JWT_REFRESH_SECRET');
  }

  async createAccessAndRefreshTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId, email }),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          expiresIn: 60 * 60 * 24 * 7,
          secret: this.jwtRefreshSecret,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
