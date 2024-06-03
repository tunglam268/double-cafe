import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO } from './dto/request.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UserStatusEnum } from '../../core/base/base.enum';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async Login(@Body() body: LoginDTO) {
    const user = await this.userService.findOne({
      username: body.username,
      status: UserStatusEnum.ACTIVE,
    });
    if (!user) {
      throw new BadRequestException('Not found user');
    }
    const compare = await bcrypt.compare(body.password, user.password);

    if (!compare) {
      throw new UnauthorizedException('Wrong username & password');
    }

    const { password, status, ...userWithoutSensitiveInfo } = user;

    const token = this.genAccessAndRefreshToken(
      {
        userWithoutSensitiveInfo,
      },
      this.jwtService,
    );

    return token;
  }

  genAccessAndRefreshToken<T>(data: T, jwtService: JwtService) {
    const plain = instanceToPlain<T>(data);
    const accessToken = jwtService.sign(plain, { expiresIn: '30m' });
    const refreshToken = jwtService.sign(plain, { expiresIn: '1d' });

    return {
      accessToken,
      refreshToken,
    };
  }
}
