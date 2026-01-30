import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDeleteComment } from "@/hooks/useDeleteComment.ts";
import { useUpdateComment } from "@/hooks/useUpdateComment.ts";
import CommentHeader from "@/components/CommentHeader.tsx";
import CommentVotes from "@/components/CommentVotes.tsx";
import { useUser } from "@/context/UserContext.tsx";
import CommentActions from "@/components/CommentActions.tsx";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.tsx";
import type { Comment } from "@/types";

interface CommentCardProps {
  comment: Comment;
  onReplyClick?: () => void;
}

export default function CommentCard({
  comment,
  onReplyClick,
}: CommentCardProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment();

  const { currentUser } = useUser();
  const isOwner = currentUser?.id === comment.user.id;

  const handleUpdate = () => {
    if (!editText.trim()) return;
    updateComment(
      { id: comment.id, content: editText },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <article className="relative flex flex-col md:flex-row gap-4 p-4 md:p-6 bg-white rounded-md shadow-sm">

      {!isEditing && (
        <div className="hidden md:block">
          <CommentVotes comment={comment} />
        </div>
      )}

      <div className="flex-1">
        <div className="flex justify-between items-center mb-3">
          <CommentHeader comment={comment} isOwner={isOwner} />

          {!isEditing && (
            <div className="hidden md:block">
              <CommentActions
                isOwner={isOwner}
                isDeleting={isDeleting}
                onEdit={() => setIsEditing(true)}
                onDelete={() => setDialogOpen(true)}
                onReply={onReplyClick}
              />
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-3 w-full">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 min-h-30 focus:outline-none focus:border-purple-600 text-gray-600 resize-none"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="bg-purple-600 text-white font-bold uppercase p-5 cursor-pointer hover:opacity-50 transition-opacity duration-300"
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 wrap-break-word leading-relaxed">
            {comment.replyingTo && (
              <span className="mr-1 text-purple-600 font-bold">
                @{comment.replyingTo}
              </span>
            )}
            {comment.content}
          </p>
        )}
      </div>

      {!isEditing && (
        <div className="flex justify-between items-center md:hidden">
          <CommentVotes comment={comment} />
          <CommentActions
            isOwner={isOwner}
            isDeleting={isDeleting}
            onEdit={() => setIsEditing(true)}
            onDelete={() => setDialogOpen(true)}
            onReply={onReplyClick}
          />
        </div>
      )}

      <DeleteConfirmModal
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() =>
          deleteComment(comment.id, { onSuccess: () => setDialogOpen(false) })
        }
        isPending={isDeleting}
      />
    </article>
  );
}
