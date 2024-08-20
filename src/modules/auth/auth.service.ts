import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { MessageEnum, UserStatusEnum } from '../../core/base/base.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { RequestContext } from 'nestjs-request-context';
import { UserService } from '../user/user.service';
import { UserRolePermissionService } from '../user-role-permission/user-role-permission.service';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userRolePermissionService: UserRolePermissionService,
    private readonly permissionService: PermissionService,
  ) {
  }

  async LoginWithToken(accessToken: string) {
    if (isEmpty(accessToken)) {
      throw new BadRequestException(MessageEnum.TOKEN_EMPTY);
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(accessToken);
    } catch (error) {
      throw new UnauthorizedException(MessageEnum.TOKEN_INVALID);
    }

    const user = await this.userService.findOneBy({
      uuid: payload.uuid,
      status: UserStatusEnum.ACTIVE,
    });

    if (!user) {
      throw new UnauthorizedException(MessageEnum.USER_NOT_FOUND);
    }

    return MessageEnum.LOGIN_SUCCESS;
  }

  async LoginWithAccount(username: string, password: string) {
    if (isEmpty(username) || isEmpty(password)) {
      throw new BadRequestException(MessageEnum.USERNAME_PASSWORD_EMPTY);
    }

    const user = await this.userService.findOneBy({
      username: username,
      status: UserStatusEnum.ACTIVE,
    });
    if (!user) {
      throw new BadRequestException(MessageEnum.USER_NOT_FOUND);
    }
    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      throw new UnauthorizedException(MessageEnum.USERNAME_PASSWORD_WRONG);
    }

    const dataToken = {
      uuid: user.uuid,
      fullName: user.fullName,
      status: user.status,
    };

    const token = this.createToken(dataToken, this.jwtService);

    return token;
  }

  private createPayloadToken<T>(data: T, type: 'ACCESS' | 'REFRESH'): Record<string, any> {
    const modifiedData = { ...data, type };
    return instanceToPlain<T>(modifiedData);
  }

  private createToken<T>(data: T, jwtService: JwtService) {
    const plainAccessToken = this.createPayloadToken(data, 'ACCESS');
    const plainRefreshToken = this.createPayloadToken(data, 'REFRESH');
    const milliSecond = 1000;
    const accessToken = jwtService.sign(plainAccessToken, {
      expiresIn: '30m',
    });
    const refreshToken = jwtService.sign(plainRefreshToken, {
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
      throw new UnauthorizedException(MessageEnum.TOKEN_INVALID);
    }

    const req: Request = RequestContext.currentContext.req;

    const urlMatch = req.url.match(/\/v1(\/[^?]+)/);

    const permission = await this.permissionService.findOneBy({
      pathApi: urlMatch[1],
    });

    const havePermission = await this.userRolePermissionService.checkPermissionOfUser({
      permissionId: permission.id,
      userId: user.id,
    });

    if (!havePermission) {
      throw new UnauthorizedException(MessageEnum.NO_PERMISSION);
    }

    const { id, password, ...result } = user;
    return result;
  }
}