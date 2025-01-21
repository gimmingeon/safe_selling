import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UserInfo } from 'src/user/decorator/userInfo.decorator';
import { AuthGuard } from '@nestjs/passport';
import { query } from 'express';
import { FindAllPosts } from './dto/FindAllPosts.dto';

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
        await this.postService.createPost(createPostDto, user);

        return { statusCode: 201, message: '게시글이 생성되었습니다.' }
    }

    // 게시판 전체 조회
    @Get('')
    async findAllPost(
        @Query() query: FindAllPosts
    ) {
        const { page, limit, search } = query
        return await this.postService.findAllPost(page, limit, search);
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
        await this.postService.updatePost(updatePostDto, postId, userId);

        return { statusCode: 200, message: '게시글이 수정되었습니다.' }
    }

    // 게시글 삭제
    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    async deletePost(
        @Param('id') postId: number,
        @UserInfo('id') userId: number
    ) {
        await this.postService.deletePost(postId, userId);

        return { statusCode: 200, message: '게시글이 삭제되었습니다.' }
    }

    // 게시글 검색
}
