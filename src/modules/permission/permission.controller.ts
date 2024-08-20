import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserInformation } from '../../core/interceptors';
import { CurrentUser } from '../../core/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('permission')
@Controller()
export class PermissionController {
  constructor() {}
}
