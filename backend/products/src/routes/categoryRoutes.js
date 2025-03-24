import express from "express";
import { getCategories, createCategory } from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get('/categories', getCategories);

categoryRouter.post('/createCategory', createCategory);

export default categoryRouter;