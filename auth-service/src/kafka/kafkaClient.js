import dotenv from 'dotenv';
dotenv.config();
import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'auth-service',
  brokers: [process.env.KAFKA_BROKER || '127.0.0.1:9092'],
  logLevel: logLevel.NOTHING,
});

export default kafka;