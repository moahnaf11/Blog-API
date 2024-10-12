import { Router } from "express";
const postRouter = Router({ mergeParams: true });

// get all posts
postRouter.get("/");

// get specific post
postRouter.get("/:id");

// create new post (authenticated users)
postRouter.post("/");

// update a post (post owner only)
postRouter.put("/:id");

// delete a post (post owner only)
postRouter.delete("/:id");

// get all comments for a post
postRouter.get("/:id/comments");

// add a comment to a post (authenticated users only)
postRouter.post("/:id/comments");

// update a comment (comment owner only)
postRouter.put("/:id/comments/:commentId");

// delete a comment (comment owner only)
postRouter.delete("/:id/comments/:commentId");

export { postRouter };
