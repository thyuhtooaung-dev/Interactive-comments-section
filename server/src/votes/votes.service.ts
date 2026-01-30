import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { Comment } from '../comments/entities/comment.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async vote(commentId: string, userId: string, value: number) {
    if (value !== 1 && value !== -1) {
      throw new BadRequestException('Vote value must be 1 or -1');
    }

    const existingVote = await this.voteRepo.findOne({
      where: {
        user: { id: userId },
        comment: { id: commentId },
      },
    });

    if (existingVote) {
      if (existingVote.value === value) {
        await this.voteRepo.remove(existingVote);
      } else {
        existingVote.value = value;
        await this.voteRepo.save(existingVote);
      }
    } else {
      const newVote = this.voteRepo.create({
        value,
        user: { id: userId },
        comment: { id: commentId },
      });
      await this.voteRepo.save(newVote);
    }

    return this.updateCommentScore(commentId);
  }

  private async updateCommentScore(commentId: string) {
    const votes = await this.voteRepo.find({
      where: { comment: { id: commentId } },
    });

    const rawScore = votes.reduce((acc, vote) => acc + vote.value, 0);
    const newScore = Math.max(0, rawScore);

    await this.commentRepo.update(commentId, { score: newScore });
    return { score: newScore };
  }
}
