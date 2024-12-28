import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/user/decorator/userInfo.decorator';

@Controller('post-comment')
export class PostCommentController {
  constructor(
    private readonly postCommentService: PostCommentService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:postId')
  async createPostComment(
    @Body() createPostCommentDto: CreatePostCommentDto,
    @Param('postId') postId: number,
    @UserInfo(['id', 'nickname']) user: { id: number, nickname: string }
  ) {
    return await this.postCommentService.createPostComment(createPostCommentDto, user, postId);
  }

  @Get(':postId')
  async findOnePostComment(
    @Param('postId') postId: number
  ) {
    return await this.postCommentService.findOnePostComment(postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePostCommentDto: UpdatePostCommentDto,
    @UserInfo('id') userId: number
  ) {
    return await this.postCommentService.updatePostComment(id, updatePostCommentDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @UserInfo('id') userId: number
  ) {
    return await this.postCommentService.remove(id, userId);
  }
}
