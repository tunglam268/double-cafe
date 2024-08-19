import {
  BadRequestException,
  Body,
  Controller,
  Get, HttpCode, HttpStatus,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
  FilterDTO,
  GetUserByFilter,
  RegisterUserDTO
} from "../../dto/user.dto";
import { MessageEnum, UserStatusEnum } from "../../core/base/base.enum";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import * as bcrypt from "bcrypt";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PageDto, PageOptionsDto } from "../../dto/pagination.dto";
import { User } from "../../entities/user.entity";
import e from "express";

@ApiTags("user")
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post("create-user")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async CreateUser(@Body() request: RegisterUserDTO) {
    const existedUsers = await this.userService.getAllBy(
      [
        {
          username: request.username,
          status: UserStatusEnum.ACTIVE
        },
        {
          phone: request.phone,
          status: UserStatusEnum.ACTIVE
        }
      ]
    );
    const duplicatePhone = existedUsers.find(user => user.phone === request.phone);
    const duplicateUserName = existedUsers.find(user => user.username === request.username);

    if (duplicatePhone) {
      throw new BadRequestException(
        "Số điện thoại đã tồn tại trong hệ thống"
      );
    } else if (duplicateUserName) {
      throw new BadRequestException(
        "Tên người dùng đã tồn tại trong hệ thống"
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
      phone: request.phone
    });
    return MessageEnum.CREATE_SUCCESS;
  }

  @Get("/list")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async ListUsers(
    @Query() filter: FilterDTO,
    @Query() pagination: PageOptionsDto
  ): Promise<PageDto<User>> {
    return await this.userService.Pagination(filter, pagination);
  }

  @Get("/detail")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async GetDetailUser(@Query() request: GetUserByFilter): Promise<User> {
    const selectField = [
      "id",
      "createdAt",
      "updatedAt",
      "deletedAt",
      "username",
      "fullName",
      "firstName",
      "lastName",
      "status",
      "mail",
      "phone"
    ];
    return await this.userService.getById(request.id, selectField);
  }

}
