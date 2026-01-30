import { Button } from "@/components/ui/button";

interface CommentActionsProps {
  isOwner: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReply?: () => void;
}

export default function CommentActions({
  isOwner,
  isDeleting,
  onEdit,
  onDelete,
  onReply,
}: CommentActionsProps) {
  const btnStyle =
    "p-0 h-auto font-bold cursor-pointer";

  if (isOwner) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 cursor-pointer hover:opacity-50 transition-opacity duration-300">
          <img src="/images/icon-delete.svg" alt="" className="size-3" />
          <Button
            variant="ghost"
            disabled={isDeleting}
            className={`${btnStyle} text-red-500`}
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:opacity-50 transition-opacity duration-300">
          <img src="/images/icon-edit.svg" alt="" className="size-3" />
          <Button
            variant="ghost"
            className={`${btnStyle} text-purple-600`}
            onClick={onEdit}
          >
            Edit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 cursor-pointer hover:opacity-50 transition-opacity duration-300">
      <img src="/images/icon-reply.svg" alt="" className="size-3" />
      <Button
        variant="ghost"
        className={`${btnStyle} text-purple-600`}
        onClick={onReply}
      >
        Reply
      </Button>
    </div>
  );
}
