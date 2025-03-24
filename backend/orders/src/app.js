import express from "express";
import bodyParser from "body-parser";
import orderRouter from "./routes/orderRoutes.js";
import { requestPrice } from "./rabbitmq/producer.js";

const app = express();

// requestPrice(3, print_price);
// function print_price(price){
//     console.log(price)
// } 

// console.log("a")
    

app.use(bodyParser.json());
app.use('/api/orders', orderRouter);

export default app;