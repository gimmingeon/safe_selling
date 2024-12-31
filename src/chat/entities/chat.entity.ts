import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoom } from "./chatRoom.entity";

@Entity({ name: "chat" })
export class Chat {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ type: 'int', nullable: false, unsigned: true })
    chatRoomId: number;

    @Column({ type: 'int', nullable: false, unsigned: true })
    senderId: number;

    @Column({ type: 'varchar', nullable: false })
    message: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chat)
    @JoinColumn()
    chatRoom: ChatRoom;
}
