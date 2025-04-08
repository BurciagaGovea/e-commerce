import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

export async function createClient(client) {
    return new Promise(async (resolve, reject) => {
        try {
            const exchange = "create_client";

            const connection = await amqp.connect(process.env.RABBIT_HOST);
            const channel = await connection.createChannel();
            await channel.assertExchange(exchange, "direct", {durable: true});
            const q = await channel.assertQueue('', {exclusive: true});
            var correlationId = generateUuid();

            channel.consume(q.queue, (msg) => {
                if (msg.properties.correlationId == correlationId) {
                    const client = JSON.parse(msg.content.toString());
                    resolve(client);
                    channel.ack(msg);

                    channel.close();
                    connection.close();
                }
            }, { noAck: false });

            const message = JSON.stringify(client);
            channel.publish(exchange, "create_client", Buffer.from(message), {correlationId, replyTo: q.queue});
            console.log(`Requested to create client`);

        } catch (error) {
            reject(error);
        }
    });
}

export async function userCreatedEvent(user) {
    let connection, channel;
    try {
        connection = await amqp.connect(process.env.RABBIT_HOST);
        channel = await connection.createChannel();

        await channel.assertExchange(process.env.RABBIT_EXCHANGE, "topic", { durable: true });

        const message = JSON.stringify(user);
        channel.publish(process.env.RABBIT_EXCHANGE, process.env.RABBIT_ROUTING_KEY, Buffer.from(message));

        console.log(`exchange "${process.env.RABBIT_EXCHANGE}", routing key "${process.env.RABBIT_ROUTING_KEY}": ${message}`);
    } catch (error) {
        console.error('Error publishing user created event:', error);
    } finally {
        if (channel) await channel.close();
        if (connection) await connection.close();
    }
}

export async function forgotPasswordEvent(user) {
    let connection, channel;
    try {
        connection = await amqp.connect(process.env.RABBIT_HOST);
        channel = await connection.createChannel();

        await channel.assertExchange(process.env.RABBIT_EXCHANGE, "topic", { durable: true });

        const message = JSON.stringify(user);
        const routingKey = 'user.forgot_password';

        channel.publish(process.env.RABBIT_EXCHANGE, routingKey, Buffer.from(message));
        console.log(`Published to exchange "${process.env.RABBIT_EXCHANGE}" with key "${routingKey}": ${message}`);
    } catch (error) {
        console.error('Error publishing forgot password event:', error);
    } finally {
        if (channel) await channel.close();
        if (connection) await connection.close();
    }
}


function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}