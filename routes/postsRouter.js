import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  getSpecificPost,
  updatePost,
} from "../controllers/postController.js";
import { authenticateToken } from "../authenticateToken.js";

const postRouter = Router({ mergeParams: true });

// get all posts
postRouter.get("/", getPosts);

// get specific post
postRouter.get("/:id", getSpecificPost);

// create new post (authenticated users)
postRouter.post("/", authenticateToken, createPost);

// update a post (post owner only)
postRouter.put("/:id", authenticateToken, updatePost);

// delete a post (post owner only)
postRouter.delete("/:id", authenticateToken, deletePost);

export { postRouter };
