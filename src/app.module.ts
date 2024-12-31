import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { RedisModule } from './redis/redis.module';
import { Post } from './post/post.entity/post.entity';
import { PostCommentModule } from './post-comment/post-comment.module';
import { PostComment } from './post-comment/entities/post-comment.entity';
import { ChatModule } from './chat/chat.module';
import { Chat } from './chat/entities/chat.entity';
import { ChatRoom } from './chat/entities/chatRoom.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      // configModule을 사용하기 위해 configService를 사용
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User, Post, PostComment, Chat, ChatRoom],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    PostModule,
    UserModule,
    AuthModule,
    MailModule,
    RedisModule,
    PostCommentModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
