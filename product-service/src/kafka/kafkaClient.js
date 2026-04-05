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
    let connected = false;

    while (!connected) {
        try {
            await producer.connect();
            await consumer.connect();
            console.log("Product Service Kafka Producer & Consumer Connected");
            connected = true; 
        } catch (error) {
            console.error(
                "Product Service Kafka Connection Error. Retrying in 5 seconds...",
                error.message
            );
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
};