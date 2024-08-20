import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import typeorm from './config/database';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RouteModule } from './routes/router.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    RouteModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    PermissionModule,
    RoleModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
