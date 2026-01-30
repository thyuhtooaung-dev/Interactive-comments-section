import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext.tsx";
import { commentService } from "@/service/comments.api.ts";
import { commentKey } from "@/hooks/useComments.ts";
import type { Comment } from "@/types";

interface CreateReplyVars {
  parentId: string;
  content: string;
  replyingTo: string;
}

export const useCreateReply = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useUser();

  return useMutation({
    mutationFn: ({ parentId, content, replyingTo }: CreateReplyVars) => {
      if (!currentUser) throw new Error("Not authenticated");
      return commentService.createReply(
        parentId,
        content,
        currentUser.id,
        replyingTo,
      );
    },

    onMutate: async ({ parentId, content, replyingTo }) => {
      await queryClient.cancelQueries({ queryKey: commentKey.all });
      const previousComments = queryClient.getQueryData<Comment[]>(
        commentKey.all,
      );

      const tempReply: Comment = {
        id: `temp-${crypto.randomUUID()}`,
        content,
        createdAt: new Date().toISOString(),
        score: 0,
        user: { ...currentUser },
        replies: [],
        votes: [],
        replyingTo,
      };

      const sortByDate = (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

      queryClient.setQueryData<Comment[]>(commentKey.all, (old = []) => {
        return old.map((rootComment) => {
          const isTarget =
            rootComment.id === parentId ||
            rootComment.replies?.some((r) => r.id === parentId);

          if (isTarget) {
            return {
              ...rootComment,
              replies: [...(rootComment.replies || []), tempReply].sort(
                sortByDate,
              ),
            };
          }
          return rootComment;
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
