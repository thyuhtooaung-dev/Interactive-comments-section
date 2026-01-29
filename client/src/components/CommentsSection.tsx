import CommentCard from "@/components/CommentCard.tsx";
import { useState } from "react";
import type { Comment } from "@/types";
import CommentForm from "@/components/CommentForm.tsx";
import ReplyList from "@/components/ReplyList.tsx";

export default function CommentsSection({ comments }: { comments: Comment[] }) {
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {comments.map((comment) => (
        <div key={comment.id} className="flex flex-col my-2 gap-4">
          <CommentCard
            comment={comment}
            onReplyClick={() => setReplyingToId(comment.id)}
          />

          {/* Form appears under Main Comment if active */}
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
              replies={comment.replies}
              replyingToId={replyingToId}
              onReplyClick={setReplyingToId}
            />
          )}
        </div>
      ))}
    </div>
  );
}
