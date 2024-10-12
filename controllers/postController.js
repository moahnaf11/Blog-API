import { getAllPosts, getSinglePost } from "../prisma/postQueries.js";

const getPosts = async (req, res) => {
  const posts = await getAllPosts();
  if (!posts) {
    return res.status(404).json({ error: "no posts" });
  }
  res.json(posts);
};

const getSpecificPost = async (req, res) => {
  const post = await getSinglePost(req.params.id);
  if (!post) {
    return res.status(404).json({ error: "cannot find the post" });
  }
  res.json(post);
};
