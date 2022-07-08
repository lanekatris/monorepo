import { Module } from '@nestjs/common';
import { GuardMe } from './guard-me.guard';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UserValidator } from './user-validator.service';

@Module({
  imports: [ConfigModule],
  providers: [UserValidator, GuardMe],
  exports: [UserValidator, GuardMe],
  controllers: [AuthController],
})
export class AuthModule {}
