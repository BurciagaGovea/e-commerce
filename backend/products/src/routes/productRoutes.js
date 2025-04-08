// import { createProduct, getProducts } from "../controllers/productController.js";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByCategory
  } from "../controllers/productController.js";
import express from "express";
//__________________imagen
import multer from 'multer';
//__________________

const productRouter = express.Router();

//______________________________________esto crea una carpeta temporal y luego se sube
const upload = multer({dest:'uploads/'})
//____________________________________

productRouter.get("/products", getProducts);

productRouter.get("/products/:id", getProductById);

productRouter.get("/products/category/:category_id", getProductsByCategory);

productRouter.post("/products", upload.single("image"), createProduct);

productRouter.put("/products/:id", updateProduct);

productRouter.delete("/products/:id", deleteProduct);

export default productRouter;