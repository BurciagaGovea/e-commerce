import amqp from "amqplib";
import dotenv from "dotenv";
import { models } from "../models/index.js";
const { Category, Product, Inventory } = models;

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
    const exchange = "product_price";
    const queue = "prices_queue"

    const connection = await amqp.connect(process.env.RABBIT_HOST);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, "direct", {durable: true});
    await channel.assertQueue(queue, {durable: true});
    await channel.bindQueue(queue, exchange, "price_request");

    channel.consume(queue, async (msg) => {
        const price_requested = JSON.parse(msg.content.toString());
        console.log("Price requested for: ", price_requested);
        const price = await Product.findByPk(price_requested, {attributes: ['price']});
        const response = JSON.stringify(price.dataValues.price)

        channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(response),
            {correlationId: msg.properties.correlationId}
        );
        channel.ack(msg);

        // console.log(price.dataValues)
        // console.log(order);
        // console.log(msg.content.toString());
        // console.log(msg.content);
    });
};