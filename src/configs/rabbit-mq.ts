import 'dotenv/config';
import express, { Request, Response } from 'express';
import amqp, { Connection, Channel } from 'amqplib';

const app = express();
app.use(express.json());

const RABBITMQ_URL = process.env.RABBITMQ_URL || '';
const EXCHANGE = 'emailExchange';

class RabbitMQ {
    private connection: Connection | null = null;
    private channel: Channel | null = null;

    async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URI as string);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange('emailExchange', 'topic', { durable: true });
            console.log('Connected to RabbitMQ and exchange created.');
        } catch (error) {
            console.error('Failed to connect to RabbitMQ:', error);
            throw error;
        }
    }

    async publish(routingKey: string, message: Record<string, any>): Promise<void> {
        if (!this.channel) {
            throw new Error('Channel is not initialized. Call connect() first.');
        }
        try {
            this.channel.publish(EXCHANGE, routingKey, Buffer.from(JSON.stringify(message)));
            console.log('Message published:', routingKey, message);
        } catch (error) {
            console.error('Failed to publish message:', error);
            throw error;
        }
    }
    async getChannel(): Promise<Channel> {
        if (!this.channel) {
            throw new Error('Channel is not initialized. Call connect() first.');
        }
        return this.channel;
    }
    async close(): Promise<void> {
        try {
            if (this.channel) await this.channel.close();
            if (this.connection) await this.connection.close();
            console.log('RabbitMQ connection closed.');
        } catch (error) {
            console.error('Failed to close RabbitMQ connection:', error);
        }
    }
}

export default new RabbitMQ();