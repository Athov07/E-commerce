import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "cart-service",
  brokers: [process.env.KAFKA_BROKER],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "cart-service-group" });

export const connectKafka = async () => {
  let connected = false;

  while (!connected) {
    try {
      await producer.connect();
      await consumer.connect();
      console.log("Cart Service Kafka Connected");
      connected = true; 
    } catch (error) {
      console.error(
        "Cart Service Kafka connection failed. Retrying in 5 seconds...",
        error.message
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};