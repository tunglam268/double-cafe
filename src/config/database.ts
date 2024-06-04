import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'mysql',
  host: `${process.env.MYSQL_HOST}`,
  port: `${process.env.MYSQL_PORT}`,
  username: `${process.env.MYSQL_USER}`,
  password: `${process.env.MYSQL_PASS}`,
  database: `${process.env.MYSQL_DB}`,
  entities: ['dist/src/**/**/entity/*.entity{.ts,.js}'],
  migrations: ['dist/src/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: true,
  logging: true,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
