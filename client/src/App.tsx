import { useComments } from "@/hooks/useComments.ts";
import CommentsSection from "@/components/CommentsSection.tsx";
import CommentForm from "@/components/CommentForm.tsx";
import Navbar from "@/components/Navbar.tsx";

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
    <main className="px-3 pb-6 flex flex-col gap-3 max-w-200 mx-auto items-center justify-center">
      <Navbar/>
      <CommentsSection comments={comments} />
      <CommentForm />
    </main>
  );
}