import { formattedTime } from "@/utils/formatTime.ts";
import type { Comment } from "@/types";

export default function CommentHeader({
  comment,
  isOwner,
}: {
  comment: Comment;
  isOwner: boolean;
}) {
  return (
    <header className="flex gap-3 items-center">
      <div className="size-8">
        <img src={comment.user.avatar} alt={comment.user.username} />
      </div>
      <div className="font-bold text-gray-800">{comment.user.username}</div>
      {isOwner && (
        <div className="font-bold bg-purple-600 text-white text-xs px-2 py-0.5 rounded-sm">
          you
        </div>
      )}
      <div className="text-gray-500">
        {formattedTime(new Date(comment.createdAt))}
      </div>
    </header>
  );
}
