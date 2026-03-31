import { Partitioners } from 'kafkajs';
import kafka from '../kafkaClient.js';

const producer = kafka.producer({ 
    createPartitioner: Partitioners.LegacyPartitioner 
});

let isConnected = false;

const connectProducer = async () => {
    if (!isConnected) {
        await producer.connect();
        isConnected = true;
    }
};

export const publishUserRegistered = async (userData) => {
    try {
        if (!isConnected) {
            await producer.connect();
            isConnected = true;
        }
        await producer.send({
            topic: 'user-registered',
            messages: [{ value: JSON.stringify(userData) }],
        });
        console.log(" Kafka: User registration event published");
    } catch (error) {
        console.error(" Kafka Producer Error:", error.message);
    }
};


export const publishAuthEvent = async (eventData) => {
    try {
        await connectProducer();
        const { userId, action, details, phone } = eventData;
        const message = {
            userId: userId || null,       
            identifier: phone || 'guest', 
            action: action,               
            details: details || {},      
            timestamp: new Date().toISOString()
        };
        await producer.send({
            topic: 'auth-audit-log',
            messages: [{ value: JSON.stringify(message) }],
        });
        console.log(`Kafka: Auth event (${action}) published`);
    } catch (error) {
        console.error("Kafka Auth Event Error:", error.message);
    }
};