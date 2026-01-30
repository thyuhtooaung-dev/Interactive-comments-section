export type User = {
  id: string;
  avatar: string;
  username: string;
};

export type Vote = {
  id: string;
  value: 1 | -1;
  user: { id: string };
};

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  score: number;
  user: User;
  replyingTo?: string | null;
  replies: Comment[];
  votes: Vote[];
}