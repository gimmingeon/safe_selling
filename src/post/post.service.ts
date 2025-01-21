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
    async findAllPost(page: number = 1, limit: number = 1, search?: string) {

        // QueryBuilder를 초기화해서 sql 쿼리 작성성
        const queryBuilder = this.postRepository.createQueryBuilder('post');

        if (search) {
            queryBuilder.where('post.title Like :search OR post.description LIKE :search', {
                search: `%${search}%`,
            });
        }

        const [posts, total] = await queryBuilder
            .select(['post.id', 'post.title', 'post.user_nickname'])
            .orderBy('post.id', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            total,
            page,
            limit,
            posts
        }
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

        await this.postRepository.findOneBy({ id: postId });
    }

    // 게시글 삭제
    async deletePost(postId: number, userId: number) {

        const post = await this.postRepository.findOneBy({ id: postId });

        if (post.userId !== userId) {
            throw new ForbiddenException('게시글은 작성한 유저만 삭제가 가능합니다.');
        }

        await this.postRepository.delete({ id: postId });
    }
}
