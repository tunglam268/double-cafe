import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { MessageEnum } from '../../../core/base/base.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-strategy') {
  constructor(private readonly authentication: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && currentTime > payload.exp) {
      throw new UnauthorizedException(MessageEnum.TOKEN_EXPIRED);
    }

    await this.authentication.ValidateUser(payload.uuid, payload.fullName);
    return payload;
  }
}
