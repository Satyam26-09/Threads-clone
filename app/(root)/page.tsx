import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const result = await fetchThreads(1, 30);
  // console.log("Fetched threads:", result);

  const user = await currentUser();
  // console.log("Current user:", user);

  // Ensure the data passed to ThreadCard is serializable(in precise the error occured in 'comments' refers to ThreadsTab.tsx)
  const serializedPosts = result.posts.map((post) => ({
    id: post._id.toString(),
    currentUserId: user?.id || "",
    parentId: post.parentId ? post.parentId.toString() : null,
    content: post.text,
    author: {
      name: post.author.name,
      image: post.author.image,
      id: post.author.id.toString(),
    },
    community: post.community
      ? {
          name: post.community.name,
          image: post.community.image,
          id: post.community.id.toString(),
        }
      : null,
    createdAt: post.createdAt.toString(),
    comments: post.children.map((comment: { image: string }) => ({
      image: comment.image,
    })),
  }));

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {serializedPosts.length === 0 ? (
          <p className="no-result">No threads found!!</p>
        ) : (
          <>
            {serializedPosts.map((post) => (
              <ThreadCard key={post.id} {...post} />
            ))}
          </>
        )}
      </section>
    </>
  );
}
