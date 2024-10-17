import { prisma } from "./prismaClient.js";

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
  });
  console.log("all posts", posts);
  return posts;
};

const getSinglePost = async (id) => {
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      author: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
  });
  console.log("single post", post);
  return post;
};

const createNewPost = async (id, title, content, published) => {
  const post = await prisma.post.create({
    data: {
      title,
      content,
      published,
      author: {
        connect: {
          id: id,
        },
      },
    },
    include: {
      author: true,
    },
  });
  console.log("new post", post);
  return post;
};

const updateUserPost = async (id, title, content, isPublished) => {
  const post = await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      title: title,
      content: content,
      published: isPublished,
    },
    include: {
      author: true,
      comments: true,
    },
  });
  console.log("updated post", post);
  return post;
};

const deleteUserPost = async (id) => {
  const deletedPost = await prisma.post.delete({
    where: {
      id: id,
    },
  });
  console.log("deleted post", deletedPost);
  return deletedPost;
};

export {
  getAllPosts,
  getSinglePost,
  createNewPost,
  updateUserPost,
  deleteUserPost,
};
