import { fetchUser, fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}
let result: any;

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  const userInfo = await fetchUser(currentUserId);

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread: any) => {
        const hasLiked = userInfo?.likedThreads?.includes(thread.id);
        return (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={
              accountType === "User" //learn why
                ? {
                    name: result.name,
                    image: result.image,
                    id: result.id,
                  }
                : {
                    name: thread.author.name,
                    image: thread.author.image,
                    id: thread.author.id,
                  }
            }
            community={
              accountType === "Community" //learn why
                ? {
                    name: result.name,
                    image: result.image,
                    id: result.id,
                  }
                : thread.community
            }
            createdAt={thread.createdAt}
            comments={thread.children.map((comment: { image: string }) => ({
              image: comment.image,
            }))}
            likes={thread.likes}
            hasLiked={hasLiked || false}
          />
        );
      })}
    </section>
  );
};

export default ThreadsTab;
