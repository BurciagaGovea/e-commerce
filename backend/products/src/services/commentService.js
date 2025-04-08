// import Comment from "../models/commentModel.js";
import { models } from "../models/index.js";

const {Comment} = models; 

export const commentService = {
  createComment: async (data) => {
    try {
      const newComment = await Comment.create(data);
      return newComment;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  getCommentsByProduct: async (product_id) => {
    try {
      return await Comment.findAll({ where: { product_id, status: true } });
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  getCommentsByUser: async (user_id) => {
    try {
      return await Comment.findAll({ where: { user_id, status: true } });
    } catch (error) {
      console.error("Error fetching user comments:", error);
      throw error;
    }
  },

  deleteComment: async (id) => {
    try {
      const comment = await Comment.findByPk(id);
      if (!comment) return null;
      comment.status = false;
      await comment.save();
      return true;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }
};