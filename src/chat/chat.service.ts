import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatRoom } from './entities/chatRoom.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {

  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) { }

  // 채팅방 생성성
  async createChatRoom(postId: number, postUserId: number, commentUserId: number) {

    const existedRoom = await this.chatRoomRepository.findOne({
      where: { postId, postUserId, commentUserId }
    });

    if (existedRoom) {
      return existedRoom;
    }

    return await this.chatRoomRepository.save({ postId, postUserId, commentUserId })
  }

  // 메세지 저장
  async saveMessage(chatRoomId: number, senderId: number, message: string) {
    return await this.chatRepository.save({
      chatRoomId,
      senderId,
      message
    });
  }

  // 채팅 메시지 조회
  async getMessages(chatRoomId: number) {
    return await this.chatRepository.find({
      where: { chatRoomId },
      order: { createdAt: 'ASC' }
    })
  }

}
