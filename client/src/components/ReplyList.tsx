import type { Replies } from "@/types";
import CommentCard from "@/components/CommentCard.tsx";
import CommentForm from "@/components/CommentForm.tsx";

export default function ReplyList({
  replies,
  replyingToId,
  onReplyClick,
}: {
  replies: Replies[];
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

          {/* Form appears under the specific Reply if active */}
          {replyingToId === reply.id && (
            <CommentForm
              parentId={reply.id}
              replyingTo={reply.user.username}
              onSuccess={() => onReplyClick(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
