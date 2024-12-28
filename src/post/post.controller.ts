import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
    @Get('/:id')
    async findOnePost(@Param('id') id: number) {
        return await this.postService.findOnePost(id);
    }

    // 게시글 수정
    @UseGuards(AuthGuard('jwt'))
    @Patch('/:id')
    async updatePost(
        @Body() updatePostDto: CreatePostDto,
        @Param('id') postId: number,
        @UserInfo('id') userId: number
    ) {
        return await this.postService.updatePost(updatePostDto, postId, userId)
    }

    // 게시글 삭제
    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    async deletePost(
        @Param('id') postId: number,
        @UserInfo('id') userId: number
    ) {
        return await this.postService.deletePost(postId, userId)
    }

    // 게시글 검색
}
