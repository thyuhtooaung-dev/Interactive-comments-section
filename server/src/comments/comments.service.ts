import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '@/comments/entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
  ) {}

  // CREATE
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
    const parent = await this.commentRepo.findOne({
      where: { id: parentId },
      relations: ['parent'],
    });

    if (!parent) {
      throw new NotFoundException(
        'The comment you are replying to does not exist.',
      );
    }

    const actualParentId = parent.parent ? parent.parent.id : parent.id;
    const repliedComment = await this.commentRepo.findOne({
      where: { id: replyingTo },
      relations: ['user'],
    });

    if (!repliedComment) {
      throw new NotFoundException(
        'The comment you are replying to does not exist.',
      );
    }
    const replyingToUsername = repliedComment.user.username;

    const reply = this.commentRepo.create({
      content,
      user: { id: userId } as any,
      parent: { id: actualParentId },
      replyingTo : replyingToUsername,
    });

    return await this.commentRepo.save(reply);
  }

  // READ (Fetching comments with their replies and users)
  async findAll() {
    return await this.commentRepo.find({
      where: { parent: IsNull() }, // Get top-level comments
      relations: [
        'user',
        'replies',
        'replies.user', // CRITICAL: This allows you to show who wrote the reply
        'votes',
      ],
      order: {
        createdAt: 'DESC',
        replies: {
          createdAt: 'ASC', // Replies usually show oldest to newest
        },
      },
    });
  }

  // UPDATE
  async update(id: string, content: string, userId: string) {
    // 1. Fetch the comment and its author
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user'], // We need this to check the owner
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    // 2. SECURITY CHECK: Compare the author ID with the requester's ID
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to edit this comment!');
    }

    // 3. Update and Save
    comment.content = content;
    return await this.commentRepo.save(comment);
  }

  // DELETE
  async remove(id: string, userId: string) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) throw new NotFoundException('Comment not found');

    // Hard check: Is the person trying to delete this actually the owner?
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own comments!');
    }

    return await this.commentRepo.remove(comment);
  }
}
