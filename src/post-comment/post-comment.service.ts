import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostComment } from './entities/post-comment.entity';

@Injectable()
export class PostCommentService {

  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>
  ) { }

  // 게시글 생성
  async createPostComment(
    createPostCommentDto: CreatePostCommentDto,
    user: { id: number, nickname: string },
    postId: number
  ) {

    return await this.postCommentRepository.save({
      postId,
      userId: user.id,
      user_nickname: user.nickname,
      description: createPostCommentDto.description
    })

  }

  // 게시글 조회
  async findOnePostComment(postid: number) {
    return await this.postCommentRepository.find({
      where: { postId: postid },
      select: {
        user_nickname: true,
        description: true,
      },
      order: { id: 'DESC' }
    });

  }

  // 게시글 수정
  async updatePostComment(
    id: number,
    updatePostCommentDto: UpdatePostCommentDto,
    userId: number
  ) {

    const postComment = await this.postCommentRepository.findOneBy({ id });

    if (userId != postComment.userId) {
      throw new ForbiddenException('작성한 유저만 수정이 가능합니다.');
    }

    await this.postCommentRepository.update(
      { id },
      {
        description: updatePostCommentDto.description
      }
    );

    return await this.postCommentRepository.findOneBy({ id });

  }

  // 게시글 삭제
  async remove(id: number, userId: number) {

    const postComment = await this.postCommentRepository.findOneBy({ id });

    if (userId != postComment.userId) {
      throw new ForbiddenException('작성한 유저만 수정이 가능합니다.');
    }

    await this.postCommentRepository.delete({ id });

    return { message: "댓글이 삭제되었습니다." }
  }
}
