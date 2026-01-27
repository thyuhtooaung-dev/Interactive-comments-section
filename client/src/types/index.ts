export type User = {
  id: string;
  avatar: string;
  username: string;
};

export type Vote = {
  id: string;
  value: 1 | -1;
};

export type Reply = {
  id: string;
  content: string;
  replyingTo: string | null;
  createdAt: string;
  score: number;
  user: User;
};

export type Comment = {
  id: string;
  content: string;
  replyingTo: null;
  createdAt: string;
  score: number;
  user: User;
  replies: Reply[];
  votes: Vote[];
};

export interface Replies {
  id: string;
  content: string;
  replyingTo: string | null;
  createdAt: string;
  score: number;
  user: User;
}

export interface CommentCard {
  id: string;
  content: string;
  replyingTo: string | null;
  createdAt: string;
  score: number;
  user: User;
  replies?: Reply[];
  votes?: Vote[];
}
