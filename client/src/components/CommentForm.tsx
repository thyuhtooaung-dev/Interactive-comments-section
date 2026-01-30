import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { useUser } from "@/context/UserContext.tsx";
import { useCreateComment } from "@/hooks/useCreateComment.ts";
import { useCreateReply } from "@/hooks/useCreateReply.ts";


interface CommentFormProps {
  parentId?: string;
  replyingToCommentId?: string;
  replyingToUsername?: string;
  onSuccess?: () => void;
}

export default function CommentForm({
  parentId,
  replyingToCommentId,
  replyingToUsername,
  onSuccess,
}: CommentFormProps) {
  const { currentUser } = useUser();
  const [content, setContent] = useState(
    replyingToUsername ? `@${replyingToUsername} ` : "",
  );

  const { mutate: createComment, isPending: isCommenting } = useCreateComment();
  const { mutate: createReply, isPending: isReplying } = useCreateReply();

  const isPending = isCommenting || isReplying;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;

    if (parentId && replyingToCommentId && replyingToUsername) {
      const cleanContent = content
        .replace(`@${replyingToUsername} `, "")
        .trim();

      createReply(
        {
          parentId,
          content: cleanContent,
          replyingTo: replyingToCommentId,
        },
        {
          onSuccess: () => {
            setContent("");
            onSuccess?.();
          },
        },
      );
    } else {
      createComment(content, {
        onSuccess: () => {
          setContent("");
          if (onSuccess) onSuccess();
        },
      });
    }
  };

  if (!currentUser) return null;

  return (
    <section className="bg-white rounded-md p-4 w-full shadow-md">
      <form
        className="flex flex-col md:flex-row gap-4 items-start"
        onSubmit={handleSubmit}
      >
        <div className="hidden md:block shrink-0">
          <img src={currentUser.avatar} alt="avatar" className="size-10" />
        </div>

        <textarea
          placeholder="Add a comment..."
          className="cursor-pointer hover:border-grey-800 min-h-25 w-full border-2 border-gray-200 rounded-md px-4 py-2 text-gray-600 focus:border-purple-600 outline-none resize-none transition-colors duration-300"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex justify-between items-center w-full md:w-auto md:flex-col md:gap-4">
          <div className="md:hidden">
            <img src={currentUser.avatar} alt="avatar" className="size-8" />
          </div>
          <Button
            disabled={isPending}
            className="bg-purple-600 hover:opacity-50 cursor-pointer text-white font-bold px-7 py-3 h-auto uppercase transition-opacity duration-300"
            type="submit"
          >
            {parentId ? "Reply" : "Send"}
          </Button>
        </div>
      </form>
    </section>
  );
}
