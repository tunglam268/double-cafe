import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.SECRET_KEY
    })
  ],
  providers: [UserService, JwtStrategy, AuthController, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtStrategy]
})
export class AuthModule {
}
