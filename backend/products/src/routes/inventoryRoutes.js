import express from "express";
import { createInventory, editStock, getInventory, getStock } from "../controllers/inventoryController.js";

const inventoryRouter = express.Router();

inventoryRouter.get('/inventory', getInventory);

inventoryRouter.get('/getStock/:product_id', getStock);

inventoryRouter.put('/editStock/:product_id', editStock);

inventoryRouter.post('/createInventory', createInventory);

export default inventoryRouter;