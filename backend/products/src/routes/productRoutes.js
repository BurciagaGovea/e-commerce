import { createProduct, getProducts } from "../controllers/productController.js";
import express from "express";
//__________________imagen
import multer from 'multer';
//__________________

const productRouter = express.Router();

//______________________________________esto crea una carpeta temporal y luego se sube
const upload = multer({dest:'uploads/'})
//____________________________________

productRouter.get('/products', getProducts);

productRouter.post('/createProduct', upload.single('image'), createProduct);

export default productRouter;