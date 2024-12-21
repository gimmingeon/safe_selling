import { IsEnum } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../type/userRole.type';

@Entity({
    name: "user"
})
export class User {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ type: 'varchar', unique: true, nullable: false })
    email: string;

    @Column({ type: 'varchar', nullable: false, select: false })
    password: string;

    @Column({ type: 'varchar', unique: true, nullable: false })
    nickname: string;

    @Column({ type: 'int', default: 0, nullable: false, unsigned: true })
    point: number;

    @IsEnum(Role)
    @Column({ type: 'enum', enum: Role, default: Role.User })
    role: Role;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;
}
