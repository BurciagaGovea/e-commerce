import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from "../controllers/orderController.js";

const wishlistRouter = express.Router();

wishlistRouter.get("/:user_id", getWishlist);
wishlistRouter.post("/add", addToWishlist);
wishlistRouter.put("/remove", removeFromWishlist);

export default wishlistRouter;
