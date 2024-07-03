import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
    return null; // Ensure to return null after redirect
  }

  const thread = await fetchThreadById(params.id);

  // Function to recursively serialize comments
  const serializeComments = (comments: any[]): any[] => {
    return comments.map((comment) => {
      const hasLiked = userInfo?.likedThreads?.includes(comment._id);
      return {
        id: comment._id.toString(),
        currentUserId: user.id || "",
        parentId: comment.parentId ? comment.parentId.toString() : null,
        content: comment.text,
        author: {
          name: comment.author.name,
          image: comment.author.image,
          id: comment.author.id.toString(),
        },
        community: thread.community
          ? {
              name: thread.community.name,
              image: thread.community.image,
              id: thread.community.id.toString(),
            }
          : null,
        createdAt: comment.createdAt.toString(),
        likes: comment.likes,
        hasLiked: hasLiked || false,
        comments: comment.children ? serializeComments(comment.children) : [], // Recursively handle nested comments
      };
    });
  };

  // Serialize thread and children for safe passing to components
  const hasLiked = userInfo?.likedThreads?.includes(thread._id);
  const serializedThread = {
    id: thread._id.toString(),
    currentUserId: user.id || "",
    parentId: thread.parentId ? thread.parentId.toString() : null,
    content: thread.text,
    author: {
      name: thread.author.name,
      image: thread.author.image,
      id: thread.author.id.toString(),
    },
    community: thread.community
      ? {
          name: thread.community.name,
          image: thread.community.image,
          id: thread.community.id.toString(),
        }
      : null,
    createdAt: thread.createdAt.toString(),
    comments: serializeComments(thread.children),
    likes: thread.likes,
    hasLiked: hasLiked || false,
  };

  return (
    <section className="relative">
      <div>
        <ThreadCard {...serializedThread} />
      </div>
      <div className="mt-7">
        {/* check for alternate */}
        <Comment
          threadId={thread._id.toString()}
          currentUserImage={userInfo.image}
          currentUserId={userInfo._id.toString()}
        />
      </div>
      <div className="mt-10">
        {serializedThread.comments.map((child: any) => (
          <ThreadCard {...child} isComment={true} key={child.id} />
        ))}
      </div>
    </section>
  );
};

export default page;
