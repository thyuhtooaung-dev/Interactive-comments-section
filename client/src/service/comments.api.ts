import api from "@/service/axios";
import type { Comment } from "@/types";

export const getComments = async (): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(`/comments`);
  return response.data;
};

export
