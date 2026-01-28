import api from "@/service/axios";
import type { Comment } from "@/types";

export const commentService = {
  getAll: async (): Promise<Comment[]> => {
    const res = await api.get<Comment[]>("/comments");
    return res.data;
  },

  createComment: async (content: string, userId: string): Promise<Comment> => {
    const res = await api.post<Comment>("/comments", { content, userId });
    return res.data;
  },

  createReply: async (
    parentId: string,
    content: string,
    userId: string,
    replyingTo: string,
  ): Promise<Comment> => {
    const res = await api.post<Comment>(`/comments/${parentId}/reply`, {
      content,
      userId,
      replyingTo,
    });
    return res.data;
  },

  update: async (
    id: string,
    content: string,
    userId: string,
  ): Promise<Comment> => {
    const res = await api.patch<Comment>(`/comments/${id}`, {
      content,
      userId,
    });
    return res.data;
  },

  delete: async (id: string, userId: string): Promise<void> => {
    await api.delete(`/comments/${id}`, { data: { userId } });
  },
};
