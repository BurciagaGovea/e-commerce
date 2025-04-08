import express from "express";
import {
  createComment,
  getCommentsByProduct,
  getCommentsByUser,
  deleteComment
} from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/comments", createComment);
commentRouter.get("/comments/product/:product_id", getCommentsByProduct);
commentRouter.get("/comments/user/:user_id", getCommentsByUser);
commentRouter.delete("/comments/:id", deleteComment);

export default commentRouter;