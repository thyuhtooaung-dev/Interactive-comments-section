import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import * as fs from 'fs';
import * as path from 'path';

interface JSONUser {
  image: {
    png: string;
    webp: string;
  };
  username: string;
}

interface JSONComment {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: JSONUser;
  replies?: JSONComment[];
}

interface JSONData {
  currentUser: JSONUser;
  comments: JSONComment[];
}

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async onApplicationBootstrap() {
    const userCount = await this.userRepo.count();
    if (userCount > 0) return;

    const filePath = path.join(process.cwd(), 'data.json');
    const rawData = fs.readFileSync(filePath, 'utf8');

    const data = JSON.parse(rawData) as JSONData;

    const usersMap = new Map<string, User>();

    const ensureUser = async (userData: JSONUser): Promise<User> => {
      const existing = usersMap.get(userData.username);
      if (existing) return existing;

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

      const parentComment = await this.commentRepo.save(
        this.commentRepo.create({
          content: commentData.content,
          score: commentData.score,
          user: author,
        }),
      );

      if (commentData.replies && commentData.replies.length > 0) {
        for (const replyData of commentData.replies) {
          const replyAuthor = await ensureUser(replyData.user);

          await this.commentRepo.save(
            this.commentRepo.create({
              content: replyData.content,
              score: replyData.score,
              user: replyAuthor,
              parent: parentComment,
              replyingTo: replyData.user.username,
            }),
          );
        }
      }
    }
  }
}
