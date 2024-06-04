import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDTO } from '../../dto/user.dto';
import { MessageEnum, UserStatusEnum } from '../../core/base/base.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async CreateUser(@Body() request: RegisterUserDTO) {
    const existedUser = await this.userService.findOneBy([
      {
        phone: request.phone,
        status: UserStatusEnum.ACTIVE,
      },
      {
        username: request.username,
        status: UserStatusEnum.ACTIVE,
      },
    ]);
    if (existedUser) {
      throw new BadRequestException(
        'Đã tồn tại tên người dùng hoặc số điện thoại trong hệ thống',
      );
    }
    const hashPassword = await bcrypt.hash(request.password, 5);
    await this.userService.create({
      username: request.username,
      password: hashPassword,
      fullName: request.fullName,
      mail: request.mail,
      firstName: request.firstName,
      lastName: request.lastName,
      status: UserStatusEnum.ACTIVE,
      phone: request.phone,
    });
    return MessageEnum.CREATE_SUCCESS;
  }
}
