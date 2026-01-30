import CommentCard from "@/components/CommentCard.tsx";
import CommentForm from "@/components/CommentForm.tsx";
import type { Comment } from "@/types";

export default function ReplyList({
  rootId,
  replies,
  replyingToId,
  onReplyClick,
}: {
  rootId: string;
  replies: Comment[];
  replyingToId: string | null;
  onReplyClick: (id: string | null) => void;
}) {
  return (
    <div className="pl-4 md:pl-10 border-l-2 border-grey-100 flex flex-col gap-3 my-4 ml-4 md:ml-10">
      {replies.map((reply) => (
        <div key={reply.id} className="flex flex-col gap-4">
          <CommentCard
            comment={reply}
            onReplyClick={() => onReplyClick(reply.id)}
          />

          {replyingToId === reply.id && (
            <CommentForm
              parentId={rootId}
              replyingToCommentId={reply.id}
              replyingToUsername={reply.user.username}
              onSuccess={() => onReplyClick(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
