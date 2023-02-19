import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPrivateSchema } from '../auth/gateways/database/user-private.schema';
import { Env } from '../core/constants/environment';
import { UserSchema } from '../users/gateways/database/user.schema';
import { DatabaseSchemas } from './schemas';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger(DatabaseModule.name);
        logger.log(`Environment: ${Env.current}`);
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          database: configService.get<string>('DB_NAME'),
          entities: [UserSchema, UserPrivateSchema],
          ...DatabaseSchemas.schemaOptions,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
