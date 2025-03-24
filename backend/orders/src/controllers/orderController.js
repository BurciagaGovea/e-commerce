// import Orders from "../models/orderModel.js";

import { models } from "../models/index.js";
const {Orders} = models;
import { publishOrder } from "../rabbitmq/producer.js";
import { orderService } from "../services/orderService.js";

export const getOrders = async(req, res) => {
    try {
        const orders = await Orders.findAll();
        if(!orders){
            return res.status(404).json({message: 'Orders not found'});
        }
        return res.status(200).json({
            orders: orders
        });
    } catch (error) {
        console.error('Error getting orders: ', error);
        return res.status(500).json({message: 'UNexpected error'});
    }
};


// llamen a dios: 00:39
export const createOrderr = async(req, res) => {
    try{
        const {client_id, products} = req.body;
        const newOrder = await orderService.createOrder(client_id, products);
        return console.log(newOrder);
    } catch(err){
        console.error(err);
    }
};

export const createOrder = async(req, res) => {
    try{
        const {client_id, total_price, status} = req.body;
        const newOrder = await Orders.create({
            client_id,
            total_price, 
            status
        });

        await publishOrder(newOrder);

        return res.status(200).json({
            message: 'Order created',
            order: newOrder
        });
    } catch(error){
        console.error('Err at creating order: ', error);
        return res.status(500).json({
            message: 'Unxpected error'
        });
    }
};