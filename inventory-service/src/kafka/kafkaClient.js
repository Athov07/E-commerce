import dotenv from 'dotenv';
dotenv.config();
import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'inventory-service',
  brokers: [process.env.KAFKA_BROKER],
  logLevel: logLevel.NOTHING,
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'inventory-service-group' });

export const connectKafka = async () => {
  let connected = false;

  while (!connected) {
    try {
      await producer.connect();
      await consumer.connect();
      console.log("Inventory Service Kafka Connected");
      connected = true;
    } catch (error) {
      console.error(
        "Inventory Service Kafka connection failed. Retrying in 5 seconds...",
        error.message
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

export default kafka;