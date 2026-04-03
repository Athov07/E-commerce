import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: 'order-service',
    brokers: [process.env.KAFKA_BROKER]
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'order-service-group' });

export const connectKafka = async () => {
    await producer.connect();
    await consumer.connect();
    console.log("Order Service Kafka Connected");
};