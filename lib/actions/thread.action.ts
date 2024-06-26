"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import connectToDB from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();

    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    //update user
    await User.findByIdAndUpdate(author, {
      //learn
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error in creating thread: ${error.message}`);
  }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();

    // calculate the number of post to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    //fetch the post tha have no parent(top level post)
    const postsQuery = await Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: "User" }) //learn
      .populate({
        path: "children",
        populate: {
          //learn & understand
          path: "author",
          model: "User",
          select: "_id name parentId image",
        },
      });

    const totalPostCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postsQuery;

    const isNext = totalPostCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Error in creating thread: ${error.message}`);
  }
}

export async function fetchThreadById(id: string) {
  try {
    connectToDB();

    //todo populate community
    const thread = await Thread.findById(id) //learn
      .populate({
        path: "author",
        model: "User",
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: "User",
            select: "_id ParentId name image",
          },
          {
            path: "children",
            model: "Thread",
            populate: {
              path: "author",
              model: "User",
              select: "_id id ParentId name image",
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Error in fetching thread: ${error.message}`);
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  try {
    connectToDB();

    //find the parent thread by id
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Thread not found");
    }

    //create new thread with comment text
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    //save the new thread(comment)
    const saveCommentThread = await commentThread.save();

    //Update original thread to include comment in it
    originalThread.children.push(saveCommentThread._id);

    //save the original thread
    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error in adding comment to thread: ${error.message}`);
  }
}
