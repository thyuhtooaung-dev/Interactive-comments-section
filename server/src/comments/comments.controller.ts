import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import { CommentsService } from '@/comments/comments.service';
import { CurrentUser } from '@common/decorators/user.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getAll() {
    return this.commentsService.findAll();
  }

  @Post()
  create(
    @Body() dto: { content: string; parentId?: string },
    @CurrentUser() userId: string,
  ) {
    return this.commentsService.createComment(
      dto.content,
      userId,
      dto.parentId,
    );
  }

  @Post(':id/reply')
  async createReply(
    @Param('id') parentId: string,
    @CurrentUser() userId: string,
    @Body() dto: { content: string; replyingTo: string },
  ) {
    return this.commentsService.createReply(parentId, dto.content, userId, dto.replyingTo);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.commentsService.remove(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body('content') content: string,
  ) {
    return this.commentsService.update(id, content, userId);
  }
}
