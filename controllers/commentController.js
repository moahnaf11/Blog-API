import {
  getAllCommenstForAPost,
  getSingleComment,
  updateUserComment,
} from "../prisma/commentQueries.js";

const getAllComments = async (req, res) => {
  const comments = await getAllCommenstForAPost(req.params.id);
  if (!comments.length) {
    return res.status(404).json({ error: "no comments on this post" });
  }
  res.json(comments);
};

const createComment = async (req, res) => {
  const { text } = req.body;
  const comment = await createComment(req.params.id, text, req.user.id);
  if (!comment) {
    return res.status(404).json({ error: "failed to create comment" });
  }
  res.json(comment);
};

const updateComment = async (req, res) => {
  const singleComment = await getSingleComment(req.params.commentId);
  if (!singleComment) {
    return res.status(404).json({ error: "comment not found" });
  }
  if (singleComment.user.id === req.user.id) {
    const comment = await updateUserComment(
      req.params.commentId,
      req.body.text
    );
  } else {
    res.status(401).json({ error: "cannot update other's comments" });
  }
};

export { getAllComments, createComment };
