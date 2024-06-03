import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from '../modules/auth/auth.module';

const APP_NAME = process.env.SERVER_NAME;
const routes: Routes = [
  {
    path: `${APP_NAME}/v1`,
    children: [{ path: '/auth', module: AuthModule }],
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
  imports: [RouterModule.register(routes), AuthModule],
})
export class RouteV1Module {}
