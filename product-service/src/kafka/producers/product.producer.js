import { producer } from "../kafkaClient.js";
import { TOPICS } from "../topics/topics.js";

export const sendProductEvent = async (eventType, data) => {
    try {
        await producer.send({
            topic: TOPICS.PRODUCT_TOPIC,
            messages: [
                { 
                    key: data._id?.toString(),
                    value: JSON.stringify({
                        event: eventType,
                        timestamp: new Date(),
                        payload: data
                    }) 
                },
            ],
        });
        console.log(`Kafka Event Sent: ${eventType}`);
    } catch (error) {
        console.error("Kafka Producer Error:", error);
    }
};