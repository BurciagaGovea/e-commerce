import { createProduct, getProducts } from "../controllers/productController.js";
import express from "express";

const productRouter = express.Router();

productRouter.get('/products', getProducts);

productRouter.post('/createProduct', createProduct);

export default productRouter;