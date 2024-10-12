import { prisma } from "./prismaClient.js";

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: true,
    },
  });
  console.log("all posts", posts);
  return posts;
};

const getSinglePost = async (req, res) => {
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      author: true,
      comments: true,
    },
  });
  console.log("single post", post);
  return post;
};

export { getAllPosts, getSinglePost };
