import { prisma } from "./prismaClient.js";

const getAllCommenstForAPost = async (id) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId: id,
    },
    include: {
      post: true,
      user: true,
    },
  });
  console.log("comments for the post", comments);
  return comments;
};

const createNewComment = async (id, text, userId) => {
  const comment = await prisma.comment.create({
    data: {
      text: text,
      post: {
        connect: {
          id: id,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      post: true,
      user: true,
    },
  });
};

const updateUserComment = async (id, text) => {
  const comment = await prisma.comment.update({
    where: {
      id: id,
    },
    data: {
      text: text,
    },
    include: {
      post: true,
      user: true,
    },
  });
  console.log("updated comment", comment);
  return comment;
};

const getSingleComment = async (id) => {
  const singleComment = prisma.comment.findUnique({
    where: {
      id: id,
    },
    include: {
      post: true,
      user: true,
    },
  });
  console.log("single comment", singleComment);
  return singleComment;
};

export { getAllCommenstForAPost, createNewComment, updateUserComment, getSingleComment };
