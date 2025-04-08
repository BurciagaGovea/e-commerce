import { commentService } from "../services/commentService.js";

export const createComment = async (req, res) => {
  try {
    const comment = await commentService.createComment(req.body);
    return res.status(201).json({ message: "Comment created", comment });
  } catch (error) {
    return res.status(500).json({ message: "Error creating comment" });
  }
};

export const getCommentsByProduct = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByProduct(req.params.product_id);
    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching comments" });
  }
};

export const getCommentsByUser = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByUser(req.params.user_id);
    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user comments" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const result = await commentService.deleteComment(req.params.id);
    if (!result) return res.status(404).json({ message: "Comment not found" });
    return res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting comment" });
  }
};
