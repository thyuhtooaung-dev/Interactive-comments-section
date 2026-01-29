import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ButtonGroup } from "@/components/ui/button-group";
import type { CommentCard } from "@/types";
import { useUser } from "@/context/user/UserContext.tsx";
import { formattedTime } from "@/utils/formatTime.ts";
import { useDeleteComment } from "@/hooks/useDeleteComment.ts";
import { useUpdateComment } from "@/hooks/useUpdateComment.ts";

interface CommentCardProps {
  comment: CommentCard;
  onReplyClick?: () => void;
}

export default function CommentCard({
  comment,
  onReplyClick,
}: CommentCardProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const { currentUser } = useUser();
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment();

  const isOwner = currentUser?.id === comment.user.id;

  const handleUpdate = () => {
    if (!editText.trim()) return;
    updateComment(
      { id: comment.id, content: editText },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <article className="flex flex-col gap-4 p-4 bg-white rounded-md">
      {/* HEADER: User Info */}
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

      {/* CONTENT AREA: Toggles between Text and Textarea */}
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
              className="bg-purple-600 hover:bg-purple-400 text-white font-bold uppercase px-6"
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 wrap-break-word">
          {comment.replyingTo && (
            <span className="mr-1 text-purple-600 font-bold">
              @{comment.replyingTo}
            </span>
          )}
          {comment.content}
        </p>
      )}

      {/* FOOTER: Score & Actions (Hidden while editing) */}
      <div
        className={`flex justify-between items-center ${isEditing ? "hidden md:flex md:invisible" : ""}`}
      >
        <ButtonGroup
          orientation="horizontal"
          aria-label="Score controls"
          className="h-fit border-2 rounded-lg items-center flex gap-2 bg-gray-100"
        >
          <Button
            variant="outline"
            size="icon"
            className="border-none text-purple-200 bg-inherit cursor-pointer hover:text-purple-600"
          >
            <PlusIcon size={16} />
          </Button>
          <span className="text-purple-600 font-bold px-1">
            {comment.score}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="border-none text-purple-200 bg-inherit cursor-pointer hover:text-purple-600"
          >
            <MinusIcon size={16} />
          </Button>
        </ButtonGroup>

        {/* Action Buttons: Only visible when NOT editing */}
        {!isEditing && (
          <div className="flex items-center gap-4">
            {isOwner ? (
              <>
                <div className="flex items-center gap-1 group cursor-pointer hover:opacity-50 transition-opacity">
                  <img
                    src="/images/icon-delete.svg"
                    alt="delete"
                    className="size-3"
                  />
                  <Button
                    variant="ghost"
                    disabled={isDeleting}
                    className="p-0 h-auto font-bold text-red-500 hover:text-red-300 hover:bg-transparent"
                    onClick={() => setDialogOpen(true)}
                  >
                    Delete
                  </Button>
                </div>

                <div className="flex items-center gap-1 group cursor-pointer hover:opacity-50 transition-opacity">
                  <img
                    src="/images/icon-edit.svg"
                    alt="edit"
                    className="size-3"
                  />
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-bold text-purple-600 hover:text-purple-300 hover:bg-transparent"
                    onClick={() => {
                      setEditText(comment.content); // Reset text on open
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1 group cursor-pointer hover:opacity-50 transition-opacity">
                <img
                  src="/images/icon-reply.svg"
                  alt="reply"
                  className="size-3"
                />
                <Button
                  variant="ghost"
                  className="p-0 h-auto font-bold text-purple-600 hover:text-purple-300 hover:bg-transparent"
                  onClick={onReplyClick}
                >
                  Reply
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-100 p-6 rounded-lg">
          <DialogHeader className="flex flex-col text-start gap-4">
            <DialogTitle className="text-xl font-bold text-slate-700">
              Delete comment
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Are you sure you want to delete this comment? This will remove the
              comment and can't be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-between gap-3 mt-4">
            <Button
              className="flex-1 bg-gray-500 hover:bg-gray-400 text-white font-bold py-3 uppercase"
              onClick={() => setDialogOpen(false)}
            >
              No, Cancel
            </Button>

            <Button
              disabled={isDeleting}
              className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-3 uppercase"
              onClick={() => {
                deleteComment(comment.id, {
                  onSuccess: () => setDialogOpen(false),
                });
              }}
            >
              {isDeleting ? "..." : "Yes, Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}
