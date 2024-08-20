import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { SwaggerConfig } from './core/swagger/swagger';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const error = validationErrors.map((error) => {
          return {
            field: error.property,
            message: Object.values(error.constraints)[0],
          };
        });

        return new BadRequestException(error);
      },
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  SwaggerConfig(app, process.env.SERVER_NAME);
  await app.listen(process.env.SERVER_PORT);
}

bootstrap();
