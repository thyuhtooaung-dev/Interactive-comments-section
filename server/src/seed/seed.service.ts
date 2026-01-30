import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { Comment } from '@/comments/entities/comment.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async onApplicationBootstrap() {
    const userCount = await this.userRepo.count();

    if (userCount > 0) {
      console.log('🌱 Database already has data, skipping seed.');
      return;
    }

    console.log('🚀 Seeding database from data.json...');

    const filePath = path.join(process.cwd(), 'data.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    const usersMap = new Map<string, User>();

    const ensureUser = async (userData: any) => {
      if (usersMap.has(userData.username))
        return usersMap.get(userData.username);

      const user = this.userRepo.create({
        username: userData.username,
        avatar: userData.image.webp,
      });
      const savedUser = await this.userRepo.save(user);
      usersMap.set(userData.username, savedUser);
      return savedUser;
    };

    await ensureUser(data.currentUser);

    for (const commentData of data.comments) {
      const author = await ensureUser(commentData.user);

      const parentComment = await this.commentRepo.save({
        content: commentData.content,
        score: commentData.score,
        createdAt: new Date(),
        user: author,
      });

      if (commentData.replies && commentData.replies.length > 0) {
        for (const replyData of commentData.replies) {
          const replyAuthor = await ensureUser(replyData.user);

          await this.commentRepo.save({
            content: replyData.content,
            score: replyData.score,
            user: replyAuthor,
            parent: parentComment,
          });
        }
      }
    }

    console.log('✅ Seeding complete!');
  }
}
