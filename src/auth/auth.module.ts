import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    // auth 모듈에서 유저를 사용하기 위해 usermodule을 가져온다.
    UserModule,
    // jwtmodule를 등록 및 import하고 어떻게 사용을 할지 설정한다
    JwtModule.register({
      global: true,

      // 여기는 jwt의 암호를 풀 수 있는 키, 비밀 키를 넣는다.
      secret: "jwtConstants.secret",
      signOptions: { expiresIn: '60s' },
    }),],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
