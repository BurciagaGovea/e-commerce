import amqp from "amqplib";
import dotenv from "dotenv";
import { json } from "express";

dotenv.config();

export async function getPrice() {
    try{
        const exchange = "product_price";
        const queue = "prices";

        const connection = await amqp.connect(process.env.RABBIT_HOST);
        const channel = await connection.createChannel();
        await channel.assertExchange(exchange, "direct", {durable:true})
        await channel.assertQueue(queue, {durable:true});
        await channel.bindQueue(queue, exchange, "prices");

        channel.consume(queue, (msg) => {
            const price = JSON.parse(msg.content.toString());
        });
    } catch(error){
        console.error(error)
    }
}