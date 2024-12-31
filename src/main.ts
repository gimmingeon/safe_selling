import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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

  // 정적 파일 제공
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(3000).then(() => {
    console.log('Server is running on http://localhost:3000');
  }).catch((err) => {
    console.error('Error starting server:', err);
  });
}
bootstrap();
