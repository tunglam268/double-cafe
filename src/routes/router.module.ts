import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from '../modules/auth/auth.module';
import { UserModule } from '../modules/user/user.module';
import { PermissionModule } from '../modules/permission/permission.module';
import { RoleModule } from '../modules/role/role.module';

const APP_NAME = process.env.SERVER_NAME;
const routes: Routes = [
  {
    path: `${APP_NAME}/v1`,
    children: [
      { path: '/auth', module: AuthModule },
      { path: '/user', module: UserModule },
      { path: '/permission', module: PermissionModule },
      { path: '/role', module: RoleModule },
    ],
  },
  {
    path: `${APP_NAME}/internal`,
  },
  {
    path: `${APP_NAME}/public`,
  },
  {
    path: `${APP_NAME}/status`,
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
    AuthModule,
    UserModule,
    PermissionModule,
    RoleModule
  ],
})
export class RouteModule {}
