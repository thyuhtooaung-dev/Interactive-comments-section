import { useState } from "react";
import CommentCard from "@/components/CommentCard.tsx";
import type { Comment } from "@/types";
import CommentForm from "@/components/CommentForm.tsx";
import ReplyList from "@/components/ReplyList.tsx";

export default function CommentsSection({ comments }: { comments: Comment[] }) {
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const handleReplyToggle = (id: string | null) => {
    setReplyingToId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="flex flex-col">
      {comments.map((comment) => (
        <div key={comment.id} className="flex flex-col my-2 gap-4">
          <CommentCard
            comment={comment}
            onReplyClick={() => handleReplyToggle(comment.id)}
          />

          {replyingToId === comment.id && (
            <div className="ml-0 md:ml-10">
              <CommentForm
                parentId={comment.id}
                replyingToCommentId={comment.id}
                replyingToUsername={comment.user.username}
                onSuccess={() => setReplyingToId(null)}
              />
            </div>
          )}

          {comment.replies.length > 0 && (
            <ReplyList
              rootId={comment.id}
              replies={comment.replies}
              replyingToId={replyingToId}
              onReplyClick={handleReplyToggle}
            />
          )}
        </div>
      ))}
    </div>
  );
}
