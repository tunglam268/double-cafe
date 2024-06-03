import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User])],
  providers: [UserService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
