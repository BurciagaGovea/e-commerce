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

export async function requestPrice(product_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const exchange = "product_price";

            const connection = await amqp.connect(process.env.RABBIT_HOST);
            const channel = await connection.createChannel();
            await channel.assertExchange(exchange, "direct", {durable: true});
            const q = await channel.assertQueue('', {exclusive: true});
            var correlationId = generateUuid();

            channel.consume(q.queue, (msg) => {
                if (msg.properties.correlationId == correlationId) {
                    const price = JSON.parse(msg.content.toString());
                    resolve(price);
                    channel.ack(msg);

                    channel.close();
                    connection.close();
                }
            }, { noAck: false });

            const message = JSON.stringify(product_id);
            channel.publish(exchange, "price_request", Buffer.from(message), {correlationId, replyTo: q.queue});
            console.log(`Price requested for product: ${product_id}`);

        } catch (error) {
            reject(error);
        }
    });
}

export async function requestPriceAvailibility(products){
    return new Promise(async (resolve, reject) =>{
        try{
            const exchange = "processProduct"
            const connection = await amqp.connect(process.env.RABBIT_HOST);
            const channel = await connection.createChannel();
            await channel.assertExchange(exchange, "direct", {durable: true});
            const q = await channel.assertQueue('', {exclusive: true});
            var correlationId = generateUuid();

            channel.consume(q.queue, (msg) => {
                if(msg.properties.correlationId == correlationId){
                    const productsAvailable = JSON.parse(msg.content.toString());
                    resolve(productsAvailable);
                    channel.ack(msg);
                    channel.close();
                    connection.close();
                }
            },
            {
                noAck: false
            }
        );

            const message = JSON.stringify(products);
            channel.publish(exchange, "product.check_availability", Buffer.from(message), {correlationId, replyTo: q.queue})

        }catch(error){
            console.error(error)
            reject(error)
        }
    })
}

export async function processOrder(products) {
    return new Promise(async (resolve, reject) => {
        try {
            const exchange = "processProduct";

            const connection = await amqp.connect(process.env.RABBIT_HOST);
            const channel = await connection.createChannel();
            await channel.assertExchange(exchange, "direct", {durable: true});
            const q = await channel.assertQueue('', {exclusive: true});
            var correlationId = generateUuid();

            channel.consume(q.queue, (msg) => {
                if (msg.properties.correlationId == correlationId) {
                    const productsAvailable = JSON.parse(msg.content.toString());
                    // console.log(productsAvailable)
                    resolve(productsAvailable);
                    channel.ack(msg);

                    channel.close();
                    connection.close();
                }
            }, { noAck: false });

            const message = JSON.stringify(products);
            channel.publish(exchange, "processProduct", Buffer.from(message), {correlationId, replyTo: q.queue});
            // console.log(`Price requested for product: ${product_id}`);

        } catch (error) {
            reject(error);
        }
    });
}

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

// requestPrice(1);

//https://www.rabbitmq.com/tutorials/tutorial-six-javascript