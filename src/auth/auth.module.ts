import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    // auth 모듈에서 유저를 사용하기 위해 usermodule을 가져온다.
    UserModule,
    // jwtmodule를 등록 및 import하고 어떻게 사용을 할지 설정한다
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule { }
