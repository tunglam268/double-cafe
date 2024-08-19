import {
  BadRequestException,
  Body,
  Controller, HttpCode, HttpStatus,
  Post,
  UnauthorizedException
} from "@nestjs/common";
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { MessageEnum, UserStatusEnum } from '../../core/base/base.enum';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { LoginDTO } from '../../dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { isEmpty } from 'class-validator';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async Login(@Body() request: LoginDTO) {
    if (request.accessToken) {
      return this.LoginWithToken(request.accessToken);
    } else {
      return this.LoginWithAccount(request.username, request.password);
    }
  }

  private async LoginWithToken(accessToken: string) {
    if (isEmpty(accessToken)) {
      throw new BadRequestException('Access token is not empty');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(accessToken);
    } catch (error) {
      throw new UnauthorizedException('Token is invalid or expired');
    }

    if (payload.status != UserStatusEnum.ACTIVE) {
      throw new UnauthorizedException('User is deactivate');
    }

    const user = await this.userService.findOneBy({
      uuid: payload.uuid,
      status: UserStatusEnum.ACTIVE,
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return MessageEnum.LOGIN_SUCCESS;
  }

  private async LoginWithAccount(username: string, password: string) {
    if (isEmpty(username) || isEmpty(password)) {
      throw new BadRequestException('Username && Password is not empty');
    }

    const user = await this.userService.findOneBy({
      username: username,
      status: UserStatusEnum.ACTIVE,
    });
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }
    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      throw new UnauthorizedException('Sai thông tin tài khoản và mật khẩu');
    }

    const dataToken = {
      uuid: user.uuid,
      fullName: user.fullName,
      status: user.status,
    };

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

  async ValidateUser(uuid: string, fullName: string) {
    const user = await this.userService.findOneBy({
      fullName: fullName,
      uuid: uuid,
    });
    if (!user) {
      throw new UnauthorizedException('Sai thông tin của token');
    }
    const { id, password, ...result } = user;
    return result;
  }
}
