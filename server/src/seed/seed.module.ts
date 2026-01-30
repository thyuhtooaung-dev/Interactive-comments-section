import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '@/users/entities/user.entity';
import { Comment } from '@/comments/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment])],
  providers: [SeedService],
})
export class SeedModule {}
