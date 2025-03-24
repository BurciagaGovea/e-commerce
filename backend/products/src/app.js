import express from "express";
import bodyParser from "body-parser";
import categoryRouter from "./routes/categoryRoutes.js";
import inventoryRouter from "./routes/inventoryRoutes.js";
import productRouter from "./routes/productRoutes.js";
import { consumerOrder, sendPrices } from "./rabbitmq/consumer.js";

const app = express();

consumerOrder();
sendPrices();

app.use(bodyParser.json());
app.use('/api/products/category', categoryRouter);
app.use('/api/products/inventory', inventoryRouter);
app.use('/api/products/product', productRouter);

export default app;