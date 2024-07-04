import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const result = await fetchThreads(1, 30);
  // console.log("Fetched threads:", result);

  const user = await currentUser();
  // console.log("Current user:", user);

  let userInfo = null;
  if (user) {
    userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");
  }

  // Ensure the data passed to ThreadCard is serializable(in precise the error occured in 'comments' refers to ThreadsTab.tsx)
  const serializedPosts = result.posts.map((post) => {
    const hasLiked = userInfo?.likedThreads?.includes(post._id);
    return {
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
      comments: post.children.map((comment: { author: { image: string } }) => ({
        author: comment.author
          ? { image: comment.author.image }
          : { image: "/assets/profile.svg" },
      })),
      likes: post.likes,
      hasLiked: hasLiked || false,
    };
  });

  // console.log(result.posts[0]);

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
