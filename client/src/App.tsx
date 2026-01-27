import { useComments } from "@/hooks/useComments.ts";
import CommentsSection from "@/components/CommentsSection.tsx";

export default function App() {
  const {data : comments, isLoading, isError} = useComments();

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

  return (
    <main className={"bg-grey-50 px-3 py-6"}>
      <CommentsSection comments={comments}/>
    </main>
  );
}