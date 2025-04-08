import amqp from "amqplib";
import dotenv from "dotenv";
import Client from "../models/clientModel.js"
// import Op from "sequelize"  mátenme
import { Op } from "sequelize";

dotenv.config();

export async function sendClient() {
    try {
        const exchange = "create_client";
        const queue = "create_client"
    
        const connection = await amqp.connect(process.env.RABBIT_HOST);
        const channel = await connection.createChannel();
    
        await channel.assertExchange(exchange, "direct", {durable: true});
        await channel.assertQueue(queue, {durable: true});
        await channel.bindQueue(queue, exchange, "create_client");

        console.log("hearing")
    
        channel.consume(queue, async (msg) => {
            try {
                const client = JSON.parse(msg.content.toString());
                console.log("Client to create: ", client);

                const clientExist = await Client.findOne({where: {[Op.or]: [{email: client.email}, {phone: client.phone}]}});

                if (clientExist){
                    console.log(`Client already registered (email or phone)`)
                    const err = JSON.stringify({ error: `Client already registered`});
                    channel.sendToQueue(
                        msg.properties.replyTo,
                        Buffer.from(err),
                        {correlationId: msg.properties.correlationId}
                    );
                    channel.ack(msg);
                    return;
                }

                const newClient = await Client.create(client)
    
                const response = JSON.stringify(newClient.dataValues)
        
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
    console.error('Error creating client', error);
    }   
};