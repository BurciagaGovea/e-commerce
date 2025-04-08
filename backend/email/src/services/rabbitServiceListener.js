import amqp from 'amqplib';
import dotenv from 'dotenv';
import transporter from "../config/emailConfig.js";

dotenv.config();

const RABBITMQ_URL = process.env.RABBIT_HOST;
const EXCHANGE = 'user_event';

export async function consumeUserCreated() {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const QUEUE = 'user_created_queue';
    const ROUTING_KEY = 'user.created';

    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    await channel.assertQueue(QUEUE, { durable: true });
    await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

    channel.consume(QUEUE, async (msg) => {
        if (msg) {
            try {
                const data = JSON.parse(msg.content.toString());
                console.log('Usuario creado:', data);

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: data.email,
                    subject: 'Registro',
                    template: 'email',
                    context: {
                        message: `Bienvenido ${data.email}`,
                        mensaje: 'Bienvenido a nuestra plataforma'
                    }
                });

                channel.ack(msg);
            } catch (err) {
                console.error('Error en bienvenida:', err.message);
                channel.nack(msg, false, false);
            }
        }
    });
}

export async function consumeForgotPassword() {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const QUEUE = 'user_forgot_password_queue';
    const ROUTING_KEY = 'user.forgot_password';

    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    await channel.assertQueue(QUEUE, { durable: true });
    await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

    channel.consume(QUEUE, async (msg) => {
        if (msg) {
            try {
                const data = JSON.parse(msg.content.toString());
                console.log('Recuperar contraseña:', data);

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: data.email,
                    subject: 'Recuperar contraseña',
                    template: 'password', // o "forgotPassword"
                    context: {
                        message: `Hola ${data.email}, recupera tu contraseña...`,
                        mensaje: 'Haz clic en el enlace para restablecer tu contraseña'
                    }
                });

                channel.ack(msg);
            } catch (err) {
                console.error('Error en recuperación:', err.message);
                channel.nack(msg, false, false);
            }
        }
    });
}
