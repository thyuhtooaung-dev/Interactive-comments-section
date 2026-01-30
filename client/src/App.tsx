import { useComments } from "@/hooks/useComments.ts";
import CommentsSection from "@/components/CommentsSection.tsx";
import CommentForm from "@/components/CommentForm.tsx";
export default function App() {
  const {data : comments, isLoading, isError} = useComments();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="/chat%20loading.gif" alt="Loading..." className="w-24 h-24" />
      </div>
    );
  }

  if (isError || !comments) {
    return <p>Failed to load comments</p>;
  }

  return (
    <main className={"px-3 py-6 flex flex-col gap-3 max-w-220 items-center justify-center"}>
      <CommentsSection
        comments={comments}
      />
      <CommentForm />
    </main>
  );
}