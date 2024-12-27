import { User } from 'src/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { PostStatus } from '../types/post-status.enum'; // PostStatus 열거형을 가져옵니다.

@Entity({
    name: "post"
})
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: false, unsigned: true })
    userId: number;

    @Column({ type: 'varchar', nullable: false })
    user_nickname: string;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'varchar', nullable: false })
    description: string;

    // @Column()
    // price: number;

    // @Column({
    //     type: 'enum',
    //     enum: PostStatus,
    //     default: PostStatus.PUBLIC,
    // })
    // status: PostStatus;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn()
    user: User;
}
