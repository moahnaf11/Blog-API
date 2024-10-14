import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from "../controllers/commentController.js";
import { authenticateToken } from "../authenticateToken.js";
const commentRouter = Router({ mergeParams: true });

// get all comments for a post
commentRouter.get("/", getAllComments);

// add a comment to a post (authenticated users only)
commentRouter.post("/", authenticateToken, createComment);

// update a comment (comment owner only)
commentRouter.put("/:commentId", authenticateToken, updateComment);

// delete a comment (comment owner only)
commentRouter.delete("/:commentId", authenticateToken, deleteComment);

export { commentRouter };
