import dotenv from "dotenv";
dotenv.config();

import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
    clientId: 'product-service',
    brokers: [process.env.KAFKA_BROKER],
    logLevel: logLevel.ERROR,
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'product-service-group' });

export const connectKafka = async () => {
    try {
        await producer.connect();
        await consumer.connect();
        console.log("Kafka Producer & Consumer Connected");
    } catch (error) {
        console.error("Kafka Connection Error:", error);
    }
};