import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comment } from '@/comments/entities/comment.entity';
import { Vote } from '@/votes/entities/vote.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  avatar!: string;

  @Column({ unique: true })
  username!: string;

  // A user can author many comments
  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  // A user can cast many votes
  @OneToMany(() => Vote, (vote) => vote.user)
  votes!: Vote[];
}
