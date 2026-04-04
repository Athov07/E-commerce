import { producer } from "../kafkaClient.js";
import { TOPICS } from "../topics/topics.js";

export const sendPaymentEvent = async (event, payload) => {
    try {
        await producer.send({
            topic: TOPICS.PAYMENT_TOPIC,
            messages: [{ 
                value: JSON.stringify({ event, payload }) 
            }]
        });
        console.log(`Payment Event Sent: ${event}`);
    } catch (error) {
        console.error("Kafka Producer Error:", error.message);
    }
};