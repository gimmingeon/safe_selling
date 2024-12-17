import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {

    constructor(
        private readonly postService: PostService
    ) { }

    // @Post()
    // async createPost(
    //     @Body() createPostDto: CreatePostDto,
    // ) {

    // }

    // 게시판 전체 조회
    @Get('')
    async findAllPost() {
        return await this.postService.findAllPost();
    }
}
