import React from "react";

interface Props {
  key: string;
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    name: string;
    image: string;
    id: string;
  } | null;
  createdAt: string;
  comments: {
    image: string;
  }[];
  isComment?: boolean;
}

const ThreadCard = ({
  key,
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
}: Props) => {
  return <article>ThreadCard</article>;
};

export default ThreadCard;
