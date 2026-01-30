import { useQuery } from "@tanstack/react-query";
import type { Comment } from "@/types";
import { commentService } from "@/service/comments.api.ts";

export const commentKey = {
  all: ["comments"] as const,
};

export const useComments = () => {
  return useQuery<Comment[]>({
    queryKey: commentKey.all,
    queryFn: commentService.getAll,
    staleTime: 1000 * 60 * 5,
    select: (data: Comment[]) => {
      const sortByDate = (a: Comment, b: Comment) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

      return data
        .map((comment) => ({
          ...comment,
          replies: Array.isArray(comment.replies)
            ? [...comment.replies].sort(sortByDate)
            : [],
        }))
        .sort(sortByDate);
    },
  });
};
