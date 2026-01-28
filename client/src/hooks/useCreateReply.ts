import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/user/UserContext.tsx";
import { commentService } from "@/service/comments.api.ts";
import { commentKey } from "@/hooks/useComments.ts";
import type { Comment } from "@/types";

interface CreateReplyVars {
  parentId: string;
  content: string;
  userId: string
  replyingTo: string;
}

export const useCreateReply = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useUser();

  return useMutation({
    mutationFn: ({ parentId, content, userId, replyingTo }: CreateReplyVars) => {
      if (!currentUser) throw new Error("Not authenticated");
      return commentService.createReply(
        parentId,
        content,
        userId,
        replyingTo,
      );
    },

    onMutate: async ({ parentId, content, replyingTo }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: commentKey.all });

      // Snapshot the previous value
      const previousComments =
        queryClient.getQueryData<Comment[]>(commentKey.all) ?? [];

      // Create the optimistic reply object
      const tempReply: Comment = {
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
        replyingTo,
      };

      // Update the cache optimistically
      queryClient.setQueryData<Comment[]>(commentKey.all, (old) => {
        return old?.map((comment) => {
          // If this is the parent comment, add the reply to its list
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, tempReply],
            };
          }

          // Even if the user replied TO a reply, the backend flattens it
          // to the root parent. So we just need to find the root parent.
          return comment;
        });
      });

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
