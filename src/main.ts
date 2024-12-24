import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000', // 클라이언트 도메인 또는 포트
    credentials: true, // 쿠키 전송 활성화
  });


  await app.listen(3000);
}
bootstrap();
