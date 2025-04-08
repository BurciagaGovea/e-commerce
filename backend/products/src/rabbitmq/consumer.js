import amqp from "amqplib";
import {Op} from "sequelize"
import dotenv from "dotenv";
import { models } from "../models/index.js";
const { Category, Product, Inventory } = models;
import sequelize from "../config/database.js";
import { json } from "express";


dotenv.config();
export async function consumerOrder() {
    const exchange = "orders_exchange";
    const queue = "orders_created"

    const connection = await amqp.connect(process.env.RABBIT_HOST);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, "direct", {durable: true});
    await channel.assertQueue(queue, {durable: true});
    await channel.bindQueue(queue, exchange, "orders");

    channel.consume(queue, (msg) => {
        const order = JSON.parse(msg.content.toString());
        console.log("llegó orden: ");
        console.log(order);
        // console.log(msg.content.toString());
        // console.log(msg.content);
    });

};

export async function sendPrices() {
    try {
        const exchange = "product_price";
        const queue = "prices_queue"
    
        const connection = await amqp.connect(process.env.RABBIT_HOST);
        const channel = await connection.createChannel();
    
        await channel.assertExchange(exchange, "direct", {durable: true});
        await channel.assertQueue(queue, {durable: true});
        await channel.bindQueue(queue, exchange, "price_request");
    
        channel.consume(queue, async (msg) => {
            try {
                const price_requested = JSON.parse(msg.content.toString());
                console.log("Price requested for: ", price_requested);
                const price = await Product.findByPk(price_requested, {attributes: ['price']});
    
                if (!price){
                    console.log(`Product ${price_requested} not found`)
                    const err = JSON.stringify({ error: `Product ${price_requested}not found}`});
                    channel.sendToQueue(
                        msg.properties.replyTo,
                        Buffer.from(err),
                        {correlationId: msg.properties.correlationId}
                    );
                    channel.ack(msg);
                    return;
                }
                const response = JSON.stringify(price.dataValues.price)
        
                channel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(response),
                    {correlationId: msg.properties.correlationId}
            );
                channel.ack(msg);
            } catch (error) {
                console.error('Error processin msg: ', error);
                channel.nack(msg, false, false);  
            }
    });
} catch (error){
    console.error('Error getting price', error);
    }   
};


export async function sendPriceAvailibility(){
    try {
        const exchange = "processProduct";
        const queue = "isAvailable"
    
        const connection = await amqp.connect(process.env.RABBIT_HOST);
        const channel = await connection.createChannel();
    
        await channel.assertExchange(exchange, "direct", {durable: true});
        await channel.assertQueue(queue, {durable: true});
        await channel.bindQueue(queue, exchange, "product.check_availability");

        channel.consume(queue, async (msg)=> {
            try {
                const products = JSON.parse(msg.content.toString());
                console.log(`Products to check: `, products);

                for(const product of products){
                    const checkProduct = await Product.findOne(
                        {
                            where: {
                                [Op.and]: [
                                    {id: product.product_id},
                                    {stock: {[Op.gte]: product.quantity}}
                                ]
                            }
                        }
                    )

                    if(!checkProduct){
                        console.log(`Product ${product.product_id} is not available`)
                        const err = JSON.stringify({
                            error: `Product ${product.product_id} not available`
                        });
                        channel.sendToQueue(
                            msg.properties.replyTo,
                            Buffer.from(err),
                            {correlationId: msg.properties.correlationId}
                        );
                        // channel.ack(msg);
                        throw new Error("Products not available")
                    }

                    product.unit_price = checkProduct.price;
                }

                const response = JSON.stringify(products);

                channel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(response),
                    {correlationId: msg.properties.correlationId}
                );
                channel.ack(msg);

            } catch (error) {
                console.error("Error processing msg", error)
                channel.nack(msg, false, false);  
            }
        })
        
    } catch (error) {
        console.error("Error listening for availibility requests: ", error);   
    }
}

//esta va a recibir productos, valida stock y busca precio. Resta el stock y responde con precios
export async function processOrder() {
    try {
        const exchange = "processProduct";
        // const queue = "prices_queue"
        const queue = "ordersQueue"
    
        const connection = await amqp.connect(process.env.RABBIT_HOST);
        const channel = await connection.createChannel();
    
        await channel.assertExchange(exchange, "direct", {durable: true});
        await channel.assertQueue(queue, {durable: true});
        await channel.bindQueue(queue, exchange, "processProduct");
    
        channel.consume(queue, async (msg) => {
            const t = await sequelize.transaction();
            try {
                const products = JSON.parse(msg.content.toString());
                console.log("Products to process: ", products);
                // const price = await Product.findByPk(price_requested, {attributes: ['price']});
                for(const product of products){
                    const productProcessed = await Product.findOne({
                        where: {
                            [Op.and]: [
                                {id: product.product_id}, 
                                {stock: { [Op.gte]: product.quantity} }
                            ]
                        },
                        transaction: t
                    });

                    if(!productProcessed){
                        console.log(`Product ${product.product_id} is not available`)
                        const err = JSON.stringify({
                            error: `Product ${product.product_id} not available`
                        });
                        channel.sendToQueue(
                            msg.properties.replyTo,
                            Buffer.from(err),
                            {correlationId: msg.properties.correlationId}
                        );
                        // channel.ack(msg);
                        throw new Error("Products not available")
                    }

                    product.unit_price = productProcessed.price;
                    productProcessed.stock -= product.quantity;
                    await productProcessed.save({transaction: t});
                }
                console.log("Products to processed: ", products);
                await t.commit();

                const response = JSON.stringify(products);
                
                channel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(response),
                    {correlationId: msg.properties.correlationId}
                );
                channel.ack(msg);

            //     if (!price){
            //         console.log(`Product ${price_requested} not found`)
            //         const err = JSON.stringify({ error: `Product ${price_requested}not found}`});
            //         channel.sendToQueue(
            //             msg.properties.replyTo,
            //             Buffer.from(err),
            //             {correlationId: msg.properties.correlationId}
            //         );
            //         channel.ack(msg);
            //         return;
            //     }
            //     const response = JSON.stringify(price.dataValues.price)
        
            //     channel.sendToQueue(
            //         msg.properties.replyTo,
            //         Buffer.from(response),
            //         {correlationId: msg.properties.correlationId}
            // );
            //     channel.ack(msg);
            } catch (error) {
                await t.rollback();
                console.error('Error processin msg: ', error);
                channel.nack(msg, false, false);  
            }
    });
} catch (error){
    
    console.error('Error getting price', error);
    }   
};