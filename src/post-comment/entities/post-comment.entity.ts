import { Post } from "src/post/post.entity/post.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({
    name: "postcomment"
})
export class PostComment {

    // id, postid, userid, description, user_nickname, createdAt, updatedAt

    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ type: 'int', nullable: false, unsigned: true })
    postId: number;

    @Column({ type: 'int', nullable: false, unsigned: true })
    userId: number;

    @Column({ type: 'varchar', nullable: false })
    user_nickname: string;

    @Column({ type: 'varchar', nullable: false })
    description: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date

    @ManyToOne(() => User, (user) => user.postComments, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    user: User;

    @ManyToOne(() => Post, (post) => post.postComments, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    post: Post;

}
