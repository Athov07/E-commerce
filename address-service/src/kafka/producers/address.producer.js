import { producer } from "../kafkaClient.js";
import { TOPICS } from "../topics/topics.js";

export const sendAddressEvent = async (event, payload) => {
    try {
        await producer.send({
            topic: TOPICS.ADDRESS_TOPIC,
            messages: [{ value: JSON.stringify({ event, payload }) }]
        });
    } catch (error) {
        console.error("Kafka Producer Error:", error);
    }
};