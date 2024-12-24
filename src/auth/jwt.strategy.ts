import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
            jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
        });
    }

    private static extractJWT(req: RequestType): string | null {
        const { Authorization } = req.cookies;
        if (Authorization) {
            const [tokenType, token] = Authorization.split(' ');
            if (tokenType !== 'Bearer')
                throw new BadRequestException('토큰 타입이 일치하지 않습니다.');
            if (!token) {
                throw new UnauthorizedException('토큰이 유효하지 않습니다.');
            }
            return token;
        }
        return null;
    }

    async validate(payload: any) {
        console.log('JWT Payload:', payload);
        const user = await this.userService.findByEmail(payload.email);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // req.user에 저장이 된다
        return { id: user.id, email: user.email };
    }
}
