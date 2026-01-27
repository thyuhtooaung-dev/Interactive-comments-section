import type { Replies } from "@/types";
import CommentCard from "@/components/CommentCard.tsx";

export default function ReplyList({ replies }: { replies: Replies[] }) {
  return (
    <div className="pl-4 border-l-2 border-grey-100 flex flex-col gap-3 my-4">
      {replies.map((reply) => (
        <CommentCard comment={reply} key={reply.id}/>
      ))}
    </div>
  );
}
