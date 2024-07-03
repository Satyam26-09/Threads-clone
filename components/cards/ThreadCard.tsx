"use client";

import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SharePopup from "../shared/SharePopup";
import { updateLike } from "@/lib/actions/thread.action";

interface Props {
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
  likes: number;
  hasLiked: boolean;
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
  likes,
  hasLiked,
}: Props) => {
  const [like, setLike] = useState(likes);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isLikeClicked, setIsLikeClicked] = useState(hasLiked);

  const handleShareClick = () => {
    setIsPopupOpen((prev) => !prev);
  };

  const handleLikeClick = async () => {
    try {
      const updatedLikes = isLikeClicked ? like - 1 : like + 1;
      setLike(updatedLikes);
      setIsLikeClicked((prev) => !prev);
      await updateLike(id, currentUserId);
    } catch (error) {
      console.error("Failed to update like", error);
      setLike((prev) => (isLikeClicked ? prev + 1 : prev - 1));
      setIsLikeClicked((prev) => !prev);
    }
  };

  const threadLink = `http://localhost:3000/thread/${id}`; //to be updated

  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 px-2 text-small-regular text-light-2">
              {content}
            </p>
            <div
              className={`${
                isComment && "mb-10"
              } mt-5 flex flex-col gap-3 mb-0`}
            >
              <div className="flex gap-3">
                <button className="flex items-center" onClick={handleLikeClick}>
                  <Image
                    src={
                      !isLikeClicked
                        ? "/assets/heart-gray.svg"
                        : "/assets/heart-filled.svg"
                    }
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                  <p className="text-subtle-medium text-gray-1 min-w-8 text-left">
                    {like}
                  </p>
                </button>

                <Link href={`/thread/${id}`} className="flex items-center">
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                  <p className="text-subtle-medium text-gray-1 min-w-8 text-left">
                    222
                  </p>
                </Link>
                <button className="flex items-center">
                  <Image
                    src="/assets/repost.svg"
                    alt="repost"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                  <p className="text-subtle-medium text-gray-1 min-w-8 text-left">
                    333
                  </p>
                </button>

                <div className="popup-container">
                  <button
                    onClick={handleShareClick}
                    className="flex items-center"
                  >
                    <Image
                      src="/assets/share.svg"
                      alt="share"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                    />
                    <p className="text-subtle-medium text-gray-1 min-w-8 text-left">
                      444
                    </p>
                  </button>
                  {isPopupOpen && (
                    <div className="popup">
                      <SharePopup
                        threadLink={threadLink}
                        onClose={handleShareClick}
                      />
                    </div>
                  )}
                </div>
              </div>
              {isComment && comments.length > 0 && (
                <Link href={`thread/${id}`}>
                  <p className="text-subtle-medium text-gray-1">
                    {comments.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* delete thread */}
        {/* show comment logos */}
      </div>
      <div className=" flex items-center">
        <span className="p-3 text-subtle-medium text-gray-1">
          {formatDateString(createdAt)}
        </span>
        {!isComment && community && (
          <Link
            href={`/communities/${community.id}`}
            className="flex items-center"
          >
            <span className="pl-5 text-subtle-medium text-gray-1">
              {community.name} Community
            </span>
            <Image
              src={community.image}
              alt={community.name}
              width={14}
              height={14}
              className="ml-1 rounded-full object-cover"
            />
          </Link>
        )}
      </div>
    </article>
  );
};

export default ThreadCard;
