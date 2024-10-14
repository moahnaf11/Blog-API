import { prisma } from "./prismaClient.js";

const getAllCommentsForAPost = async (id) => {
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
  console.log("comment created", comment);
  return comment;
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
  const singleComment = await prisma.comment.findUnique({
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

const deleteUserComment = async (id) => {
  const deletedComment = await prisma.comment.delete({
    where: {
      id: id,
    },
  });
  console.log("deleted comment", deletedComment);
  return deletedComment;
};

export {
  getAllCommentsForAPost,
  createNewComment,
  updateUserComment,
  getSingleComment,
  deleteUserComment,
};
