import {
  createNewPost,
  deleteUserPost,
  getAllPosts,
  getSinglePost,
  updateUserPost,
} from "../prisma/postQueries.js";

const getPosts = async (req, res) => {
  console.log("get called")
  const posts = await getAllPosts();
  if (!posts.length) {
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

const createPost = async (req, res) => {
  const id = req.user.id;
  const { title, content, published } = req.body;
  const isPublished = published === "true";
  const post = await createNewPost(id, title, content, isPublished);
  if (!post) {
    return res.status(404).json({ error: "post not created" });
  }
  res.json(post);
};

const updatePost = async (req, res) => {
  const userId = req.user.id;
  const post = await getSinglePost(req.params.id);
  if (!post) {
    return res.status(404).json({ error: "post not found" });
  }
  if (post.userId === userId) {
    const { title, content, published } = req.body;
    const updatedPost = await updateUserPost(
      req.params.id,
      title,
      content,
      published
    );
    res.json(updatedPost);
  } else {
    res.status(401).json({ error: "cannot update soneone else's post" });
  }
};

const deletePost = async (req, res) => {
  const userId = req.user.id;
  const post = await getSinglePost(req.params.id);
  if (!post) {
    return res.status(404).json({ error: "post not found" });
  }
  if (post.userId === userId) {
    const deletePost = await deleteUserPost(req.params.id);
    res.json(deletePost);
  } else {
    res.status(401).json({ error: "cannot delete someone else's post" });
  }
};

export { getPosts, getSpecificPost, createPost, updatePost, deletePost };
