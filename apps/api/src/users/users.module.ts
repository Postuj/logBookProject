import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UserEntityRepository } from './gateways/database/user-entity.repository';
import { UserSchemaMapper } from './gateways/database/user-schema.mapper';
import { UserSchema } from './gateways/database/user.schema';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserSchema])],
  controllers: [],
  providers: [UserEntityRepository, UserSchemaMapper],
  exports: [UserEntityRepository, UserSchemaMapper],
})
export class UsersModule {}
