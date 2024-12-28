import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {

    // 생성자 ()안에 숏컷으로 입력 가능
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
    ) { }

    // 게시글 생성
    async createPost(createPostDto: CreatePostDto, user: { id: number, nickname: string }) {
        const { title, description } = createPostDto;

        return await this.postRepository.save({
            title,
            description,
            userId: user.id,
            user_nickname: user.nickname
        })
    }

    //게시물 전체 조회
    async findAllPost() {
        return await this.postRepository.find({
            select: {
                title: true,
                user_nickname: true
            },
            order: { id: 'DESC' }
        });
    }

    // 게시글 상세 조회
    async findOnePost(id: number) {

        const post = await this.postRepository.findOneBy({ id: id });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.')
        }

        return post
    }

    // 게시글 수정
    async updatePost(updatePostDto: CreatePostDto, postId: number, userId: number) {
        const { title, description } = updatePostDto;

        const post = await this.postRepository.findOneBy({ id: postId });

        if (post.userId !== userId) {
            throw new ForbiddenException('게시글은 작성한 유저만 수정이 가능합니다.');
        }

        await this.postRepository.update(
            { id: postId },
            {
                title,
                description
            });

        return await this.postRepository.findOneBy({ id: postId });
    }

    // 게시글 삭제
    async deletePost(postId: number, userId: number) {

        const post = await this.postRepository.findOneBy({ id: postId });

        if (post.userId !== userId) {
            throw new ForbiddenException('게시글은 작성한 유저만 삭제가 가능합니다.');
        }

        await this.postRepository.delete({ id: postId });

        return { message: "게시글이 삭제되었습니다." };
    }
}
