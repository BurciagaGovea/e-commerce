import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

export async function publishOrder(order) {
    const exchange = "orders_exchange";

    const connection = await amqp.connect(process.env.RABBIT_HOST);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, "direct", {durable: true});
    // const queue = await channel.assertQueue("orders_Created", {durable: true});

    const message = JSON.stringify(order);
    channel.publish(exchange, "orders", Buffer.from(message));

    setTimeout(() => {
        connection.close();
      }, 500);
};

export async function requestPrice(product_id, callback) {
    const exchange = "product_price";

    const connection = await amqp.connect(process.env.RABBIT_HOST);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, "direct", {durable:true});
    const q = await channel.assertQueue('', {exclusive:true});
    var correlationId = generateUuid();

    channel.consume(q.queue, (msg) => {
        if (msg.properties.correlationId == correlationId){
            // console.log(msg.content.toString());
            // console.log("aqí sí")
            const price = JSON.parse(msg.content.toString());
            // console.log(price);
            callback(price);
            
        }
    });

    const message = JSON.stringify(product_id);

    channel.publish(exchange, "price_request", Buffer.from(message), {correlationId: correlationId, replyTo: q.queue});
    console.log(`Price requested for product: ${product_id}`);
};

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

// requestPrice(1);

//https://www.rabbitmq.com/tutorials/tutorial-six-javascript