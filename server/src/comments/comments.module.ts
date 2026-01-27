import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from '@/comments/comments.service';
import { CommentsController } from '@/comments/comments.controller';
import {Comment} from '@/comments/entities/comment.entity';
import { Vote } from '@/votes/entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Vote])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
