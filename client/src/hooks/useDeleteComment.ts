import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentKey } from "@/hooks/useComments";
import { commentService } from "@/service/comments.api";
import { useUser } from "@/context/UserContext.tsx";
import type { Comment } from "@/types";

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useUser();

  return useMutation({
    mutationFn: (commentId: string) => {
      if (!currentUser) throw new Error("Not authenticated");
      return commentService.delete(commentId, currentUser.id);
    },

    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({ queryKey: commentKey.all });

      const previousComments =
        queryClient.getQueryData<Comment[]>(commentKey.all) ?? [];

      queryClient.setQueryData<Comment[]>(commentKey.all, (old) => {
        if (!old) return old;

        return old
          .filter((comment) => comment.id !== commentId)
          .map((comment) => ({
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== commentId),
          }));
      });

      return { previousComments };
    },

    onError: (_err, _commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentKey.all, context.previousComments);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentKey.all });
    },
  });
};
