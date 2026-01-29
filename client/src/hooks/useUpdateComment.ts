import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/user/UserContext.tsx";
import { commentService } from "@/service/comments.api.ts";
import { commentKey } from "@/hooks/useComments.ts";
import type { Comment } from "@/types";

interface UpdateCommentVars {
  id: string;
  content: string;
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useUser();

  return useMutation({
    mutationFn: ({ id, content }: UpdateCommentVars) => {
      if (!currentUser) throw new Error("Not authenticated");
      return commentService.update(id, content, currentUser.id);
    },

    onMutate: async ({ id, content }) => {
      await queryClient.cancelQueries({ queryKey: commentKey.all });

      const previousComments =
        queryClient.getQueryData<Comment[]>(commentKey.all) ?? [];

      queryClient.setQueryData<Comment[]>(commentKey.all, (old) => {
        if (!old) return [];

        return old.map((comment) => {
          // 1. Check if the root comment is the one being updated
          if (comment.id === id) {
            return { ...comment, content };
          }

          // 2. If not, check if it's one of the replies
          // We map over replies regardless, returning a new replies array if changed
          const updatedReplies = comment.replies.map((reply) =>
            reply.id === id ? { ...reply, content } : reply,
          );

          return { ...comment, replies: updatedReplies };
        });
      });

      return { previousComments };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentKey.all, context.previousComments);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentKey.all });
    },
  });
};
