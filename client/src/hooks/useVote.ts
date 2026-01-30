import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext.tsx";
import { commentKey } from "@/hooks/useComments";
import type { Comment, Vote } from "@/types";
import { votesService } from "@/service/votes.api.ts";

export const useVote = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useUser();

  return useMutation({
    mutationFn: ({
      commentId,
      value,
    }: {
      commentId: string;
      value: 1 | -1;
    }) => {
      if (!currentUser) throw new Error("Not authenticated");
      return votesService.vote(commentId, value, currentUser.id);
    },

    onMutate: async ({ commentId, value }) => {
      await queryClient.cancelQueries({ queryKey: commentKey.all });
      const previousComments = queryClient.getQueryData<Comment[]>(
        commentKey.all,
      );

      if (!currentUser || !previousComments) return { previousComments };

      const updateCommentInTree = (list: any[]): any[] => {
        return list.map((comment) => {
          if (comment.id === commentId) {
            const existingVote = comment.votes?.find(
              (v: Vote) => v.user.id === currentUser.id,
            );
            let newScore = comment.score;
            let newVotes = [...(comment.votes || [])];

            if (existingVote) {
              newScore -= existingVote.value;
              newVotes = newVotes.filter((v) => v.user.id !== currentUser.id);
            } else {
              newScore += value;
              newVotes.push({
                id: "temp-vote",
                value,
                user: { id: currentUser.id },
              });
            }

            return {
              ...comment,
              score: Math.max(0, newScore),
              votes: newVotes,
            };
          }

          if (comment.replies?.length > 0) {
            return {
              ...comment,
              replies: updateCommentInTree(comment.replies),
            };
          }
          return comment;
        });
      };

      queryClient.setQueryData<Comment[]>(commentKey.all, (old) => {
        if (!old) return [];

        const updatedTree = updateCommentInTree(old);

        const sortByDate = (a: Comment, b: Comment) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

        return [...updatedTree].sort(sortByDate).map((root) => ({
          ...root,
          replies: root.replies ? [...root.replies].sort(sortByDate) : [],
        }));
      });
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
