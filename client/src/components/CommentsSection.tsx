import type { Comment } from "@/types";
import ReplyList from "@/components/ReplyList.tsx";
import CommentCard from "@/components/CommentCard.tsx";

export default function CommentsSection({ comments }: { comments: Comment[] }) {
  return (
    <div className="flex flex-col">
      {comments.map((comment) => (
        <div className="flex flex-col">
          <CommentCard comment={comment} />

          {comment.replies.length > 0 && (
            <ReplyList replies={comment.replies} />
          )}
        </div>
      ))}
    </div>
  );
}
