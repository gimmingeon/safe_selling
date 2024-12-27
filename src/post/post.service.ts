import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {

    // 생성자 ()안에 숏컷으로 입력 가능
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
    ) { }

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
        return await this.postRepository.find();
    }
}
