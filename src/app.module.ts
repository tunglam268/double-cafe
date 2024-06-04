import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import typeorm from './config/database';
import { RouteV1Module } from './routes/router-v1.module';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    RouteV1Module,
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
