import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

enum Env {
  LOCAL = 'local',
  DEVELOP = 'develop',
  PRODUCTION = 'production',
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const configService = app.get(ConfigService);
  const env = configService.get<Env>('NODE_ENV', Env.LOCAL);

  if (env !== Env.PRODUCTION) {
    const config = new DocumentBuilder()
      .setTitle(`Todo's API`)
      .setDescription(`The Todo's API description`)
      .setVersion('1.0')
      .addSecurity('AccessCookie', {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
        description: 'JWT access token в HttpOnly cookie',
      })
      .addSecurity('RefreshCookie', {
        type: 'apiKey',
        in: 'cookie',
        name: 'refresh_token',
        description: 'JWT refresh token в HttpOnly cookie',
      })
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, documentFactory);
  }


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
