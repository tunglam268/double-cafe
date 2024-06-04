import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UserStatusEnum } from '../../core/base/base.enum';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { LoginDTO } from '../../dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async Login(@Body() request: LoginDTO) {
    const user = await this.userService.findOneBy({
      username: request.username,
      status: UserStatusEnum.ACTIVE,
    });
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }
    const compare = await bcrypt.compare(request.password, user.password);

    if (!compare) {
      throw new UnauthorizedException('Sai thông tin tài khoản và mật khẩu');
    }

    const dataToken = { id: user.uuid, fullName: user.fullName };

    const token = this.GenAccessAndRefreshToken(dataToken, this.jwtService);

    return token;
  }

  private GenAccessAndRefreshToken<T>(data: T, jwtService: JwtService) {
    const plain = instanceToPlain<T>(data);
    const milliSecond = 1000;
    const accessToken = jwtService.sign(plain, {
      expiresIn: '30m',
    });
    const refreshToken = jwtService.sign(plain, {
      expiresIn: '1d',
    });

    const expiredAccessToken = jwtService.verify(accessToken).exp * milliSecond;

    const expiredRefreshToken =
      jwtService.verify(accessToken).exp * milliSecond;

    return {
      accessToken,
      expiredAccessToken,
      refreshToken,
      expiredRefreshToken,
    };
  }

  async ValidateUser(ID: string, username: string) {
    const user = await this.userService.findOneBy({
      username: username,
      uuid: ID,
    });
    if (!user) {
      throw new UnauthorizedException('Sai thông tin của token');
    }
    const { id, uuid, password, ...result } = user;
    return result;
  }
}
