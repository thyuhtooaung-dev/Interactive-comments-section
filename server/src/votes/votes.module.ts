import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { Comment } from '@/comments/entities/comment.entity';
import { VotesService } from '@/votes/votes.service';
import { VotesController } from '@/votes/votes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Comment])],
  providers: [VotesService],
  controllers: [VotesController],
})
export class VotesModule {}
