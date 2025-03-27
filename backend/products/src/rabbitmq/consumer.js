import amqp from "amqplib";
import dotenv from "dotenv";
import { models } from "../models/index.js";
const { Category, Product, Inventory } = models;

//SOLO LO MODIFIQUE PARA PODER APAGAR RABIT PARA PROBAR LO DE DRIVE_______

dotenv.config();

//____________________________________________________________1
const RABBIT_ENABLED = process.env.RABBIT_ENABLED === 'true';
//____________________________________________________________1

export async function consumerOrder() {

    //_________________________Cambio 1
    if(!RABBIT_ENABLED) return;
    //_________________________Cambio 1


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


    //_________________________Cambio 2
    if(!RABBIT_ENABLED) return;
    //_________________________Cambio 2


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