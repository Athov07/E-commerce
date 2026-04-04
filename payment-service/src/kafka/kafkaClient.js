import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: 'payment-service',
    brokers: [process.env.KAFKA_BROKER]
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'payment-service-group' });

export const connectKafka = async () => {
    try {
        await producer.connect();
        await consumer.connect();
        console.log("Payment Service Kafka Connected");
    } catch (error) {
        console.error("Kafka Connection Error:", error.message);
    }
};