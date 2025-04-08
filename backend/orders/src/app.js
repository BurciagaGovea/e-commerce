import express from "express";
import bodyParser from "body-parser";
import orderRouter from "./routes/orderRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import { requestPrice } from "./rabbitmq/producer.js";
import { orderService } from "./services/orderService.js";

const app = express();

// requestPrice(3, print_price);
// function print_price(price){
//     console.log(price)
// } 

// console.log("a")


// const pro = [
//     {"product_id": "5", "quantity": "3"},
//     {"product_id": "6", "quantity": "2"}
// ]
    
// await orderService.generateOrder(2, pro);

app.use(bodyParser.json());
app.use('/api/orders', orderRouter);
app.use("/wishlist", wishlistRouter);

export default app;