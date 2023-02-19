import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUserCommand } from '../../domain/commands/login-user/login-user.command';
import { LoginUserCommandOutput } from '../../domain/commands/login-user/login-user.handler';
import { LogoutUserCommand } from '../../domain/commands/logout-user/logout-user.command';
import { RefreshAccessTokenCommand } from '../../domain/commands/refresh-access-token/refresh-access-token.command';
import { RefreshAccessTokenCommandOutput } from '../../domain/commands/refresh-access-token/refresh-access-token.handler';
import { RegisterUserCommand } from '../../domain/commands/register-user/register-user.command';
import { RegisterUserCommandOutput } from '../../domain/commands/register-user/register-user.handler';
import { Public } from '../../../core/public';
import { GetUser } from '../../../users/delivery/decorators/user.decorator';
import { User } from '../../../users/domain/entities/user.entity';
import { LoginRequestDto } from '../dto/login/login-request.dto';
import { LoginResponseDto } from '../dto/login/login-response.dto';
import { RefreshAccessTokenRequestDto } from '../dto/refresh-access-token/refresh-access-token-request.dto';
import { RefreshAccessTokenResponseDto } from '../dto/refresh-access-token/refresh-access-token-response.dto';
import { RegisterRequestDto } from '../dto/register/register-request.dto';
import { RegisterResponseDto } from '../dto/register/register-response.dto';
import { JwtRefreshTokenAuthGuard } from '../guards/jwtRefreshToken-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { UserPrivate } from '../../domain/entities/user-private.entity';
import { GetUserPrivate } from '../decorators/user-private.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async logIn(
    @GetUser() user: User,
    @Body() dto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    const tokens = await this.commandBus.execute<
      LoginUserCommand,
      LoginUserCommandOutput
    >(new LoginUserCommand(user.id));
    return tokens;
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async singUp(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const { email, password } = registerDto;
    const tokens = await this.commandBus.execute<
      RegisterUserCommand,
      RegisterUserCommandOutput
    >(new RegisterUserCommand(email, password));

    return tokens;
  }

  @Public()
  @UseGuards(JwtRefreshTokenAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(
    @GetUserPrivate() userPrivate: UserPrivate,
    @Body() dto: RefreshAccessTokenRequestDto,
  ): Promise<RefreshAccessTokenResponseDto> {
    const { accessToken, refreshToken } = await this.commandBus.execute<
      RefreshAccessTokenCommand,
      RefreshAccessTokenCommandOutput
    >(new RefreshAccessTokenCommand(userPrivate));

    return {
      accessToken,
      refreshToken,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@GetUser() user: User) {
    return this.commandBus.execute<LogoutUserCommand, void>(
      new LogoutUserCommand(user.id),
    );
  }
}
