import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext.tsx";
import { commentService } from "@/service/comments.api.ts";
import { commentKey } from "@/hooks/useComments.ts";
import type { Comment } from "@/types";

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useUser();

  return useMutation({
    mutationFn: (content: string) => {
      if (!currentUser) throw new Error("Not authenticated");
      return commentService.createComment(content, currentUser.id);
    },

    onMutate: async (content: string) => {
      await queryClient.cancelQueries({ queryKey: commentKey.all });

      const previousComments =
        queryClient.getQueryData<Comment[]>(commentKey.all) ?? [];

      const tempComment: Comment = {
        id: `temp-${crypto.randomUUID()}`,
        content,
        createdAt: new Date().toISOString(),
        score: 0,
        user: {
          id: currentUser.id,
          avatar: currentUser.avatar,
          username: currentUser.username,
        },
        replies: [],
        votes: [],
        replyingTo: null,
      };

      queryClient.setQueryData<Comment[]>(commentKey.all, [
        ...previousComments,
        tempComment,
      ]);

      return { previousComments };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentKey.all, context.previousComments);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentKey.all });
    },
  });
};
