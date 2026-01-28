import { useComments } from "@/hooks/useComments.ts";
import CommentsSection from "@/components/CommentsSection.tsx";
import { useUser } from "@/context/user/UserContext";
import CommentForm from "@/components/CommentForm.tsx";
import { useCreateComment } from "@/hooks/useCreateComment.ts";
export default function App() {
  const {data : comments, isLoading, isError} = useComments();
  const {currentUser} = useUser()
  const { mutate, isPending } = useCreateComment();

  const handleCreateComment = ( content: string) => {
    if (!content.trim()) return;
    mutate(content);
  };

  if (isLoading) {
    return (
      <div className={"flex justify-center items-center min-h-screen"}>
        loading...
      </div>
    );
  }

  if (isError || !comments) {
    return <p>Failed to load comments</p>;
  }

  if (!currentUser) {
    return <p>Failed to load current user</p>;
  }

  return (
    <main className={"bg-grey-50 px-3 py-6 flex flex-col gap-3"}>
      <CommentsSection
        comments={comments}
      />
      <CommentForm
        currentUser={currentUser}
        onCreateReply={handleCreateComment}
        isPending={isPending}
      />
    </main>
  );
}