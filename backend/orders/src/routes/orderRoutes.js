import express from "express";
import { createOrder, createOrderr, getOrders } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get('/orders', getOrders);

orderRouter.post('/createOrder', createOrderr);

export default orderRouter;