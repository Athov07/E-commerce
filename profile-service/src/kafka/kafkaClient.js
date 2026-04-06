import dotenv from "dotenv";
dotenv.config();
import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
    clientId: 'profile-service',
    brokers: [process.env.KAFKA_BROKER],
    logLevel: logLevel.ERROR,
    connectionTimeout: 10000, 
    requestTimeout: 25000,
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'profile-service-consumer-group' });

export const connectKafka = async () => {
    let connected = false;
    while (!connected) {
        try {
            await producer.connect();
            await consumer.connect();
            console.log("Profile Service Kafka Producer & Consumer Connected");
            connected = true; 
        } catch (error) {
            console.error("Kafka Connection Failed. Retrying in 5s...", error.message);
            await new Promise(resolve => setTimeout(resolve, Number(5000)));
        }
    }
};

export default kafka;