import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '@/comments/entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
  ) {}

  // Helper Function
  private async getCommentAndVerifyOwner(id: string, userId: string) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You are not authorized for this action');
    }
    return comment;
  }

  async createComment(content: string, userId: string) {
    const comment = this.commentRepo.create({
      content,
      user: { id: userId },
    });
    return await this.commentRepo.save(comment);
  }

  async createReply(
    parentId: string,
    content: string,
    userId: string,
    replyingTo: string,
  ) {
    const targetComment = await this.commentRepo.findOne({
      where: { id: parentId },
      relations: ['parent'],
    });

    if (!targetComment) throw new NotFoundException('Comment not found');

    const rootParentId = targetComment.parent
      ? targetComment.parent.id
      : targetComment.id;

    const repliedUser = await this.commentRepo.findOne({
      where: { id: replyingTo },
      relations: ['user'],
    });

    const reply = this.commentRepo.create({
      content,
      user: { id: userId },
      parent: { id: rootParentId },
      replyingTo: repliedUser?.user.username || 'unknown',
    });

    return await this.commentRepo.save(reply);
  }

  async findAll() {
    return this.commentRepo.find({
      where: { parent: IsNull() },
      order: {
        createdAt: 'ASC',
        replies: { createdAt: 'ASC' },
      },
      relations: [
        'user',
        'votes',
        'votes.user',
        'replies',
        'replies.user',
        'replies.votes',
        'replies.votes.user',
      ],
    });
  }

  async update(id: string, content: string, userId: string) {
    const comment = await this.getCommentAndVerifyOwner(id, userId);
    comment.content = content;
    return await this.commentRepo.save(comment);
  }

  async remove(id: string, userId: string) {
    const comment = await this.getCommentAndVerifyOwner(id, userId);
    return await this.commentRepo.remove(comment);
  }
}
