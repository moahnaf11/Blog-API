import {
  createNewComment,
  deleteUserComment,
  getAllCommentsForAPost,
  getSingleComment,
  updateUserComment,
} from "../prisma/commentQueries.js";

const getAllComments = async (req, res) => {
  const comments = await getAllCommentsForAPost(req.params.id);
  if (!comments.length) {
    return res.status(404).json({ error: "no comments on this post" });
  }
  res.json(comments);
};

const createComment = async (req, res) => {
  const comment = await createNewComment(
    req.params.id,
    req.body.text,
    req.user.id
  );
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
    res.json(comment);
  } else {
    res.status(401).json({ error: "cannot update other's comments" });
  }
};

const deleteComment = async (req, res) => {
  const singleComment = await getSingleComment(req.params.commentId);
  if (!singleComment) {
    return res.status(404).json({ error: "comment not found" });
  }
  if (singleComment.user.id === req.user.id) {
    const comment = await deleteUserComment(req.params.commentId);
    res.json(comment);
  } else {
    res.status(401).json({ error: "cannot delete other's comments" });
  }
};

export { getAllComments, createComment, updateComment, deleteComment };
