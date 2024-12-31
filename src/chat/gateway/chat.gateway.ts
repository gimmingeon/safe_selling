import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat.service';

// @WebSocketGateway({namespace}) 여기서 namespace는 url 경로의 일부
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: 'http://localhost:3000', // 클라이언트 주소
    credentials: true, // 쿠키를 포함한 요청을 허용
  },
})
export class ChatGateway {

  // websocket 서버 인스턴스 : 클라이언트와 연결을 관리하고 메시지 전달과 이벤트 전파한다.
  @WebSocketServer()
  server: Server

  // 게이트웨이는 실시간 이벤트를 처리하고 데이터 처리는 service가 당담
  constructor(
    private readonly chatService: ChatService
  ) {
    console.log('WebSocket Gateway initialized');
  }

  // 클라이언트를 해당 채팅방에 참여시키기 위함
  @SubscribeMessage('joinChatRoom')
  async handleJoinRoom(
    // 클라이언트가 보낸 데이터를 처리 (데이터를 가져옴)
    @MessageBody() data: { postId: number; postUserId: number; commentUserId: number },
    // 웹소켓과 연결되 클라이언트의 socket 객체를 가져온다 (채팅방에 연결하도록 한다.)
    @ConnectedSocket() client: Socket,
  ) {
    console.log("방 생성");
    console.log('Client joined room:', data);
    const chatRoom = await this.chatService.createChatRoom(data.postId, data.postUserId, data.commentUserId);

    // 클라이언트를 특정 방에 참여시킨다.
    client.join(`chat-room-${chatRoom.id}`);
    // 클라이언트가 성공적으로 방에 참여함을 알린다. (emit은 클라이언트에게 알리는 역할)
    client.emit('joinedRoom', { chatRoomId: chatRoom.id });

    // try {
    //   const chatRoom = await this.chatService.createChatRoom(data.postId, data.postUserId, data.commentUserId);
    //   client.join(`chat-room-${chatRoom.id}`);
    //   client.emit('joinedRoom', { chatRoomId: chatRoom.id });
    // } catch (error) {
    //   console.error('Error in joinChatRoom:', error);
    //   client.emit('error', { message: 'Failed to join the chat room' });
    // }
  }

  // 클라이언트가 메시지를 저장하고 같은 방의 다른 사용자에게 메시지 전달
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { chatRoomId: number; senderId: number; message: string },
    @ConnectedSocket() client: Socket,
  ) {

    console.log("메세지 전달");
    // 받은 메시지를 데이터베이스에 저장
    await this.chatService.saveMessage(data.chatRoomId, data.senderId, data.message);
    // 해당 방의 모든 클라이언트에게 메시지 전송(to(방의) 클라이언트에게 알림(emit))
    this.server.to(`chat-room-${data.chatRoomId}`).emit('receiveMessage', data);
  }

  // 채팅방의 모든 메시지를 데이터베이스에서 가져온다.
  @SubscribeMessage('fetchMessages')
  async handleFetchMessages(
    @MessageBody() data: { chatRoomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log("메세지 조회")
    const messages = await this.chatService.getMessages(data.chatRoomId);
    // 조회한 메시지를 전달 (이전 메시지를 확인하도록 한다)
    client.emit('messages', messages);
  }
}
