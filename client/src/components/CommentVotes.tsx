import { MinusIcon, PlusIcon } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button.tsx";
import { useVote } from "@/hooks/useVote.ts";
import { useUser } from "@/context/UserContext.tsx";
import type { Comment } from "@/types";

export default function CommentVotes({ comment }: { comment: Comment }) {
  const { mutate: vote, isPending: isVoting } = useVote();
  const { currentUser } = useUser();

  const userVote = comment.votes?.find((v) => v.user.id === currentUser?.id);
  const hasUpvoted = userVote?.value === 1;
  const hasDownvoted = userVote?.value === -1;

  const handleVote = (val: 1 | -1) => {
    if (isVoting) return;

    const canVote =
      !userVote || (val === 1 && hasUpvoted) || (val === -1 && hasDownvoted);

    if (canVote) {
      vote({ commentId: comment.id, value: val });
    }
  };

  return (
    <ButtonGroup className="bg-gray-100 rounded-lg flex items-center overflow-hidden md:flex-col md:p-1">
      <Button
        variant="ghost"
        size="icon"
        disabled={isVoting || hasDownvoted}
        onClick={() => handleVote(1)}
        className={`h-10 w-8 cursor-pointer ${hasUpvoted ? "text-purple-600 opacity-100" : "text-purple-200 hover:text-purple-600"}`}
      >
        <PlusIcon size={14} strokeWidth={hasUpvoted ? 4 : 2} />
      </Button>

      <span className="text-purple-600 font-bold px-2 text-center select-none">
        {comment.score}
      </span>

      <Button
        variant="ghost"
        size="icon"
        disabled={
          isVoting || hasUpvoted || (comment.score === 0 && !hasDownvoted)
        }
        onClick={() => handleVote(-1)}
        className={`h-10 w-8 cursor-pointer ${hasDownvoted ? "text-purple-600 opacity-100" : "text-purple-200 hover:text-purple-600"}`}
      >
        <MinusIcon size={14} strokeWidth={hasDownvoted ? 4 : 2} />
      </Button>
    </ButtonGroup>
  );
}
