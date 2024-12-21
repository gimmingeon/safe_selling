import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {
        super({
            // 사용자 정보를 조회 jwt 토큰을 사용해서
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: RequestType) => request.cookies?.access_token,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findByEmail(payload.email);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }
        return { id: user.id, email: user.email };
    }
}
