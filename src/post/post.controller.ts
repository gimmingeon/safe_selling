import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UserInfo } from 'src/user/decorator/userInfo.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {

    constructor(
        private readonly postService: PostService
    ) { }

    // 게시글 생성
    @UseGuards(AuthGuard('jwt'))
    @Post('')
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @UserInfo(['id', 'nickname']) user: { id: number, nickname: string }
    ) {
        return await this.postService.createPost(createPostDto, user);
    }

    // 게시판 전체 조회
    @Get('')
    async findAllPost() {
        return await this.postService.findAllPost();
    }

    // 게시글 상세 조회

    // 게시글 검색

    // 게시글 수정

    // 게시글 삭제
}
