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
import { LoginRequestDto, LoginResponseDto } from '../dto/login.dto';
import { RefreshAccessTokenRequestDto } from '../dto/refresh-access-token.dto';
import { RegisterRequestDto, RegisterResponseDto } from '../dto/register.dto';
import { JwtRefreshTokenAuthGuard } from '../guards/jwtRefreshToken-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { UserPrivate } from '../../domain/entities/user-private.entity';
import { GetUserPrivate } from '../decorators/user-private.decorator';
import { AuthTokensDto } from '../dto/auth-tokens.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: AuthTokensDto })
  @Post('login')
  async logIn(
    @GetUser() user: User,
    @Body() dto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    const tokensAndUserId = await this.commandBus.execute<
      LoginUserCommand,
      LoginUserCommandOutput
    >(new LoginUserCommand(user.id));
    return tokensAndUserId;
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiForbiddenResponse()
  @ApiCreatedResponse({ type: AuthTokensDto })
  @Post('signup')
  async singUp(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const { email, password } = registerDto;
    const tokensAndUserId = await this.commandBus.execute<
      RegisterUserCommand,
      RegisterUserCommandOutput
    >(new RegisterUserCommand(email, password));

    return tokensAndUserId;
  }

  @Public()
  @UseGuards(JwtRefreshTokenAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: AuthTokensDto })
  @Post('refresh-token')
  async refreshToken(
    @GetUserPrivate() userPrivate: UserPrivate,
    @Body() dto: RefreshAccessTokenRequestDto,
  ): Promise<AuthTokensDto> {
    const { accessToken, refreshToken } = await this.commandBus.execute<
      RefreshAccessTokenCommand,
      RefreshAccessTokenCommandOutput
    >(new RefreshAccessTokenCommand(userPrivate));

    return {
      accessToken,
      refreshToken,
    };
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  logout(@GetUser() user: User) {
    return this.commandBus.execute<LogoutUserCommand, void>(
      new LogoutUserCommand(user.id),
    );
  }
}
