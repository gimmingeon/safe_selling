import { Post } from "src/post/post.entity/post.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";

@Entity({ name: "chat_room" })
export class ChatRoom {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ type: 'int', nullable: false, unsigned: true })
    postId: number; // 관련된 게시글 ID

    @Column({ type: 'int', nullable: false, unsigned: true })
    postUserId: number; // 게시글 작성자 ID

    @Column({ type: 'int', nullable: false, unsigned: true })
    commentUserId: number;  // 댓글 작성자 ID

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => Post, (post) => post.chatRoom)
    @JoinColumn()
    post: Post;

    @OneToMany(() => Chat, (chat) => chat.chatRoom)
    chat: Chat[];
}
