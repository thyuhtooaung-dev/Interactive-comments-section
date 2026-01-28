import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import type { CommentCard } from "@/types";
import { useUser } from "@/context/user/UserContext.tsx";
import { formattedTime } from "@/utils/formatTime.ts";

interface CommentCardProps {
  comment: CommentCard;
  onReplyClick?: () => void;
}

export default function CommentCard({ comment, onReplyClick }: CommentCardProps) {
  const { currentUser } = useUser();
  const Owner = currentUser?.id === comment.user.id;

  return (
    <article className={"flex flex-col gap-4 p-4 bg-white rounded-md"}>
      <header className={"flex gap-3 items-center"}>
        <div className={"size-8"}>
          <img src={comment.user.avatar} alt={comment.user.username} />
        </div>
        <div className={"font-bold"}>{comment.user.username}</div>
        {Owner && (
          <div
            className={
              "font-bold bg-purple-600 text-white text-xs px-3 py-0.5 rounded-sm"
            }
          >
            you
          </div>
        )}
        <div className={"text-grey-500"}>
          {formattedTime(new Date(comment.createdAt))}
        </div>
      </header>
      <p className={"text-grey-500 "}>
        {comment.replyingTo && (
          <span className={"mr-1 text-purple-600 font-bold"}>
            @{comment.replyingTo}
          </span>
        )}
        {comment.content}
      </p>
      <div className={"flex justify-between"}>
        <ButtonGroup
          orientation="horizontal"
          aria-label="Media controls"
          className="h-fit border-2 rounded-lg items-center flex gap-2 bg-gray-100"
        >
          <Button
            variant="outline"
            size="icon"
            className={"border-none text-purple-200 bg-inherit cursor-pointer"}
          >
            <PlusIcon />
          </Button>
          <span className={"text-purple-600 font-medium"}>{comment.score}</span>
          <Button
            variant="outline"
            size="icon"
            className={"border-none text-purple-200 bg-inherit cursor-pointer"}
          >
            <MinusIcon />
          </Button>
        </ButtonGroup>
        <div className={"flex items-center gap-2"}>
          {Owner ? (
            <>
              <div className={"flex items-center"}>
                <img
                  src="/images/icon-delete.svg"
                  alt="delete icon"
                  className="size-4"
                />
                <Button
                  className={
                    "bg-white border-none text-pink-400 font-bold cursor-pointer"
                  }
                >
                  Delete
                </Button>
              </div>
              <div className={"flex items-center"}>
                <img
                  src="/images/icon-edit.svg"
                  alt="delete icon"
                  className="size-4"
                />
                <Button
                  className={
                    "bg-white border-none text-purple-600 font-bold cursor-pointer"
                  }
                >
                  Edit
                </Button>
              </div>
            </>
          ) : (
            <div className={"flex items-center"}>
              <img
                src="/images/icon-reply.svg"
                alt="reply icon"
                className="size-4"
              />
              <Button
                className={
                  "bg-white border-none text-purple-600 font-bold cursor-pointer"
                }
                onClick={onReplyClick}
              >
                Reply
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
