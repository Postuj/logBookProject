import { Module } from '@nestjs/common';
import { AuthService } from './domain/services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessTokenStrategy } from './delivery/strategies/jwt-access-token/jwt-access-token.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPrivateEntityRepository } from './gateways/database/user-private-entity.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './delivery/controllers/auth.controller';
import { JwtRefreshTokenStrategy } from './delivery/strategies/jwt-refresh-token/jwt-refresh-token.strategy';
import { LocalStrategy } from './delivery/strategies/local/local.strategy';
import { LoginUserHandler } from './domain/commands/login-user/login-user.handler';
import { LogoutUserHandler } from './domain/commands/logout-user/logout-user.handler';
import { RefreshAccessTokenHandler } from './domain/commands/refresh-access-token/refresh-access-token.handler';
import { RegisterUserHandler } from './domain/commands/register-user/register-user.handler';
import { UserPrivateFactory } from './domain/factories/user-private.factory';
import { UserPrivateSchemaMapper } from './gateways/database/user-private-schema.mapper';
import { UserPrivateSchema } from './gateways/database/user-private.schema';
import { UsersModule } from '../users/users.module';

const commandHandlers = [
  RegisterUserHandler,
  LoginUserHandler,
  RefreshAccessTokenHandler,
  LogoutUserHandler,
];

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: 60 * 60 },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserPrivateSchema]),
    CqrsModule,
    UsersModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    UserPrivateEntityRepository,
    UserPrivateFactory,
    UserPrivateSchemaMapper,
    ...commandHandlers,
  ],
  exports: [AuthService],
})
export class AuthModule {}
