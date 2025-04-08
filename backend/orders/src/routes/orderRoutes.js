import express from "express";
import {addToCart, createOrderr, getOrders, getOrdersDetails, payCart, getWishlist, addToWishlist, removeFromWishlist } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get('/orders', getOrders);

orderRouter.post('/createOrder', createOrderr);

orderRouter.get('/details/:order_id', getOrdersDetails);

//otro archivo
orderRouter.post('/add', addToCart);

orderRouter.put('/pay/:client_id', payCart)

//otro archivo







export default orderRouter;