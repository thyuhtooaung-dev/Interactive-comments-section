import { Controller, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('comments/:commentId/vote')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  async handleVote(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @CurrentUser() userId: string,
    @Body('value') value: number,
  ) {
    return this.votesService.vote(commentId, userId, value);
  }
}
