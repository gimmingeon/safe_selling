import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {

    // 생성자 ()안에 숏컷으로 입력 가능
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
    ) { }


    //게시물 전체 조회
    async findAllPost() {
        return await this.postRepository.find();
    }
}
