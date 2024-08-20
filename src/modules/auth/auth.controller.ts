import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { LoginDTO } from '../../dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async Login(@Body() request: LoginDTO) {
    if (request.accessToken) {
      return this.authService.LoginWithToken(request.accessToken);
    } else {
      return this.authService.LoginWithAccount(request.username, request.password);
    }
  }
}
