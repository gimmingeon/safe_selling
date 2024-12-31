import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chatRoom.entity';
import { Chat } from './entities/chat.entity';
import { ChatGateway } from './gateway/chat.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Chat])],
  controllers: [],
  providers: [ChatService, ChatGateway],
})
export class ChatModule { }
