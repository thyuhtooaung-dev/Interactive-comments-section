import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { Comment } from '@/comments/entities/comment.entity';

@Entity('votes')
@Unique(['user', 'comment'])
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int' })
  value!: number;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Comment, (comment) => comment.votes, { onDelete: 'CASCADE' })
  comment!: Comment;
}
