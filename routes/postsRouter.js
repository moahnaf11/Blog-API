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

// middleware to check role of user
const checkRole = async (req, res, next) => {
  console.log("req.user object", req.user);
  if (req.user.role === "AUTHOR") {
    return next();
  } else {
    res
      .status(401)
      .json({ error: "only authors can create/ update and delete posts" });
  }
};

// get all posts
postRouter.get("/", getPosts);

// get specific post
postRouter.get("/:id", getSpecificPost);

// create new post (authenticated users)
postRouter.post("/", authenticateToken, checkRole, createPost);

// update a post (post owner only)
postRouter.put("/:id", authenticateToken, checkRole, updatePost);

// delete a post (post owner only)
postRouter.delete("/:id", authenticateToken, checkRole, deletePost);

export { postRouter, checkRole };
