import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthController } from '../auth.controller';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-strategy') {
  constructor(private readonly authentication: AuthController) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: any) {
    await this.authentication.ValidateUser(payload.id, payload.username);
    return payload;
  }
}
