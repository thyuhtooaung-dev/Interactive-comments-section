import api from "@/service/axios";

export const votesService = {
  vote: async (commentId: string, value: number, userId: string) => {
    const res = await api.post<{ score: number }>(
      `/comments/${commentId}/vote`,
      {
        value,
        userId,
      },
    );
    return res.data;
  },
};
