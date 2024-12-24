import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly client: Redis;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.client = new Redis({
            host: this.configService.get<string>('REDIS_HOST'),
            port: this.configService.get<number>('REDIS_PORT'),
            password: this.configService.get<string>('REDIS_PASSWORD'),

            // 연결 실패 시 재시도 시간
            retryStrategy: (times) => {
                return Math.min(times * 2000, 30000);
            },
        });
    }

    // 다른 서비스가 사용할수 있도록 반환
    getClient(): Redis {
        console.log("레디스 연결 성공");
        return this.client;
    }
}