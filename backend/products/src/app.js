import express from "express";
import bodyParser from "body-parser";
import categoryRouter from "./routes/categoryRoutes.js";
import inventoryRouter from "./routes/inventoryRoutes.js";
import productRouter from "./routes/productRoutes.js";
import commentRouter from "./routes/commentRouter.js";

import { consumerOrder, sendPrices, processOrder, sendPriceAvailibility } from "./rabbitmq/consumer.js";

const app = express();

consumerOrder();
sendPrices();
processOrder();
sendPriceAvailibility();

app.use(bodyParser.json());

app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);   
app.use('/api/inventory', inventoryRouter);
app.use('/api', commentRouter);

export default app;